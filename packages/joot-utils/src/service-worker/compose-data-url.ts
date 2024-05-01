import { IScrollSizePayload } from "joot-types"

function stringToUint8Array(input: string) {
    const array = new Array<number>(input.length)
    for (let i = 0; i < input.length; i++) {
        array[i] = input.charCodeAt(i)
    }
    return new Uint8Array(array)
}

function dataURLtoBlob(data_url: string) {
    const [prefix, plain] = data_url.split(',')
    const contentType = prefix.split(':')[1].split(';')[0]

    const base64string = atob(plain)
    const uint8Array = stringToUint8Array(base64string)

    return new Blob([uint8Array], { type: contentType })
}

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resovle) => {
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
            resovle(<string>e.target?.result)
        })
        reader.readAsDataURL(blob)
    })
}

function createCanvas(width: number, height: number) {
    return new globalThis.OffscreenCanvas(width, height)
}

export async function composeDataURL(payload: IScrollSizePayload, data_url_array: Array<string>) {
    const { content_width, content_height, inner_width, inner_height } = payload
    const canvas = createCanvas(content_width, content_height)
    const context = canvas.getContext('2d')

    if (!context) {
        throw new Error("canvas context is undefined")
    }

    let x = 0, y = 0
    for (const data_url of data_url_array) {
        const blob = dataURLtoBlob(data_url)
        const bit_map = await globalThis.createImageBitmap(blob)
        context.drawImage(bit_map, x, y)
        let x_next_start = x + inner_width
        let x_next_end = x_next_start + inner_width
        if (x_next_start === content_width) {
            x = 0
            let y_next_start = y + inner_height
            let y_next_end = y_next_start + inner_height
            if (y_next_start === content_height) {
                continue
            } else if (y_next_end > content_height) {
                y_next_start = content_height - inner_height
                y_next_end = content_height
                y = y_next_start
            } else {
                y = y_next_start
            }
        } else if (x_next_end > content_width) {
            x_next_start = content_width - inner_width
            x_next_end = content_width
            x = x_next_start
        } else {
            x = x_next_start
        }
    }

    const blob = await canvas.convertToBlob()
    const data_url = await blobToDataURL(blob)
    return data_url
}