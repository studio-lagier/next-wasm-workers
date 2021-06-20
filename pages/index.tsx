import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const wasmWorkerRef = useRef<Worker | null>();
  const tsWorkerRef = useRef<Worker | null>();

  const [wasmWorkerMessages, setWasmWorkerMessages] = useState<String[]>([]);
  const [tsWorkerMessages, setTsWorkerMessages] = useState<String[]>([]);

  useEffect(() => {
    // From https://webpack.js.org/guides/web-workers/#syntax
    wasmWorkerRef.current = new Worker(
      new URL('../src/wasm.worker.ts', import.meta.url)
    );
    tsWorkerRef.current = new Worker(
      new URL('../src/ts.worker.ts', import.meta.url)
    );

    wasmWorkerRef.current.addEventListener('message', (evt) => {
      console.log('Message from wasm worker:', evt.data);
      const newMessages = [...wasmWorkerMessages, evt.data];
      setWasmWorkerMessages(newMessages);
    });

    tsWorkerRef.current.addEventListener('message', (evt) => {
      console.log('Message from TS worker:', evt.data);
      const newMessages = [...tsWorkerMessages, evt.data];
      setTsWorkerMessages(newMessages);
    });

    wasmWorkerRef.current.postMessage({ type: 'start' });
    tsWorkerRef.current.postMessage({ type: 'start' });
  }, []);

  return (
    <div>
      <h2>Wasm worker messages:</h2>
      <pre>
        {wasmWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join('\n\n')}
      </pre>
      <h2>TS worker messages:</h2>
      <pre>
        {tsWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join('\n\n')}
      </pre>
    </div>
  );
}
