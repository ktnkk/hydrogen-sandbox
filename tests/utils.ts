/* eslint-disable import/no-extraneous-dependencies,eslint-comments/disable-enable-pair */
import {
  chromium,
  type Page,
  type Response as PlaywrightResponse,
} from 'playwright';
import { createServer as createViteDevServer } from 'vite';
import type { Server } from 'http';

export const DEFAULT_DELAY = 60000;

export type HydrogenSession = {
  page: Page;
  visit: (pathname: string) => Promise<PlaywrightResponse | null>;
};

export type HydrogenServer = {
  url: (pathname: string) => string;
  newPage: () => Promise<HydrogenSession>;
  cleanUp: () => Promise<void>;
  watchForUpdates: (_module: any) => void;
};

const getPortFromAddress = (address: string | any): number => {
  if (typeof address === 'string') {
    return parseInt(address.split(':').pop()!);
  } else {
    return address.port;
  }
};

const createDevServer = async () => {
  const app = await createViteDevServer({
    server: { force: true },
    logLevel: 'silent',
  });
  const server = await app.listen(0);

  return {
    server: server.httpServer,
    port: getPortFromAddress(server.httpServer!.address()),
  };
};

const createNodeServer = async () => {
  // @ts-ignore
  const { createServer } = await import('../dist/node');
  const app = (await createServer()).app;
  const server = app.listen(0) as Server;
  const port: number = await new Promise((resolve) => {
    server.on('listening', () => {
      resolve(getPortFromAddress(server.address()));
    });
  });

  return { server, port };
};

export const startHydrogenServer = async (): Promise<HydrogenServer> => {
  const app = import.meta.env.WATCH
    ? await createDevServer()
    : await createNodeServer();

  const browser = await chromium.launch();
  const url = (pathname: string) => `http://localhost:${app.port}${pathname}`;

  const newPage = async () => {
    const page = await browser.newPage();
    return {
      page,
      visit: async (pathname: string) => page.goto(url(pathname)),
    };
  };

  const cleanUp = async () => {
    await browser.close();
    await app.server?.close();
  };

  return { url, newPage, cleanUp, watchForUpdates: () => {} };
};
