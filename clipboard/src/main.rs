use std::io;

use chrome_native_messaging::{send_message, Error};

use clipboard_rs::{
    common::RustImage, Clipboard, ClipboardContext, ClipboardHandler, ClipboardWatcher,
    ClipboardWatcherContext, RustImageData,
};

use serde::Serialize;

#[derive(Serialize)]
enum MessageType {
    Text,
    Image,
}

#[derive(Serialize)]
struct Message<'a, T> {
    data: &'a T,
    message_type: MessageType,
    total: u8,
    index: u8,
}

impl<'a, T> Message<'a, T>
where
    T: Serialize,
{
    fn new(data: &'a T, message_type: MessageType) -> Message<'a, T> {
        Message {
            data,
            message_type,
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
    image_rgb_size: u32,
}

impl ClipboardRecord {
    fn set_text(&mut self, string: &String) {
        self.text = string.clone();
    }
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
                image_rgb_size: 0,
            },
        }
    }
}

impl ClipboardHandler for Manager {
    fn on_clipboard_change(&mut self) {
        let text_handler = |text: String| Message::new(&text, MessageType::Text).send().ok();
        self.ctx.get_text().map(text_handler).ok();

        let image_hanlder = |image_data: RustImageData| {
            image_data.to_png().map(|image_buf| {
                Message::new(&(image_buf.get_bytes()), MessageType::Image)
                    .send()
                    .ok()
            })
        };
        self.ctx.get_image().map(image_hanlder).ok();
    }
}

fn main() {
    let mut watcher = ClipboardWatcherContext::new().unwrap();
    let manager = Manager::new();

    watcher.add_handler(manager);
    watcher.start_watch();
}
