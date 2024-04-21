use clipboard::manager::Manager;
use clipboard_rs::{ClipboardWatcher, ClipboardWatcherContext};

fn main() {
    let mut watcher = ClipboardWatcherContext::new().unwrap();
    let manager = Manager::new();

    watcher.add_handler(manager);
    watcher.start_watch();
}
