use clipboard_rs::{common::RustImage, Clipboard, ClipboardContext, ClipboardHandler};

use crate::message::{EClipboardFormat, Message};

struct ClipboardRecord {
    text: String,
    image: Vec<u8>,
}

pub struct Manager {
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
