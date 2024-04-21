use chrome_native_messaging::{send_message, Error};
use serde::Serialize;
use std::io;

#[derive(Serialize)]
pub enum EClipboardFormat {
    Text,
    Image,
}

#[derive(Serialize)]
pub struct Message<'a, T> {
    data: &'a T,
    format: EClipboardFormat,
    total: u8,
    index: u8,
}

impl<'a, T> Message<'a, T>
where
    T: Serialize,
{
    pub fn new(data: &'a T, format: EClipboardFormat) -> Message<'a, T> {
        Message {
            data,
            format,
            total: 1,
            index: 1,
        }
    }
    pub fn send(self: Message<'a, T>) -> Result<(), Error> {
        send_message(io::stdout(), &self)
    }
}
