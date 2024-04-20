use std::io;

use chrome_native_messaging::{send_message, Error};

use clipboard_rs::{
    common::RustImage, Clipboard, ClipboardContext, ClipboardHandler, ClipboardWatcher,
    ClipboardWatcherContext,
};

use serde::Serialize;

#[derive(Serialize)]
enum EClipboardFormat {
    Text,
    Image,
}

#[derive(Serialize)]
struct Message<'a, T> {
    data: &'a T,
    format: EClipboardFormat,
    total: u8,
    index: u8,
}

impl<'a, T> Message<'a, T>
where
    T: Serialize,
{
    fn new(data: &'a T, format: EClipboardFormat) -> Message<'a, T> {
        Message {
            data,
            format,
            total: 1,
            index: 1,
        }
    }
    fn send(self: Message<'a, T>) -> Result<(), Error> {
        send_message(io::stdout(), &self)
    }
}

struct ClipboardRecord {
    text: String,
    image: Vec<u8>,
}

struct Manager {
    ctx: ClipboardContext,
    clipboard_record: ClipboardRecord,
}

impl Manager {
    pub fn new() -> Self {
        Manager {
            ctx: ClipboardContext::new().unwrap(),
            clipboard_record: ClipboardRecord {
                text: String::from(""),
                image: vec![],
            },
        }
    }
}

impl ClipboardHandler for Manager {
    fn on_clipboard_change(&mut self) {
        let clipboard_record = &mut self.clipboard_record;

        if let Ok(text) = self.ctx.get_text() {
            if clipboard_record.text != text {
                Message::new(&text, EClipboardFormat::Text).send().ok();
                clipboard_record.text = text;
            };
        };

        if let Ok(image_data) = self.ctx.get_image() {
            if let Ok(image) = image_data.to_png() {
                let bytes = image.get_bytes();
                if clipboard_record.image.len() != bytes.len() && clipboard_record.image != bytes {
                    Message::new(&bytes, EClipboardFormat::Image).send().ok();
                    clipboard_record.image.resize(bytes.len(), 0);
                    // clipboard_record.image.clear();
                    clipboard_record.image.copy_from_slice(&bytes);
                };
            };
        };
    }
}

fn main() {
    let mut watcher = ClipboardWatcherContext::new().unwrap();
    let manager = Manager::new();

    watcher.add_handler(manager);
    watcher.start_watch();
}
