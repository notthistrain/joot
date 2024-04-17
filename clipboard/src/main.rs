use chrome_native_messaging::send_message;
use serde::Serialize;
use std::{io, thread, time::Duration};

#[derive(Serialize)]
struct BasicMessage<'a> {
    payload: &'a str,
}

fn main() {
    loop {
        thread::sleep(Duration::from_secs(3));
        send_message(
            io::stdout(),
            &BasicMessage {
                payload: "native message data",
            },
        )
        .expect("failed to send to stdout")
    }
}
