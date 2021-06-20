// Needed to declare this as a module. Also shows that imports
// function normally in workers.
import { shared } from './shared';
const ctx: Worker = self as unknown as Worker;

async function start() {
  ctx.postMessage({
    type: 'tsData',
    data: shared,
  });
}

ctx.addEventListener('message', (evt) => {
  switch (evt.data.type) {
    case 'start':
      start();
      return;
  }
});
