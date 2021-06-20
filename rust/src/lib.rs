mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet() {
    log_1(&"Hello from Rust".into());
}

#[wasm_bindgen]
pub fn get_rust_data() -> String {
    "Some data from Rust".into()
}