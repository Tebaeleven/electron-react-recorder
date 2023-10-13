// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};
ipcRenderer.on('SET_SOURCE', async () => {
  console.log('dad');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: 'screen:4:0',
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });
    handleStream(stream);
  } catch (e) {
    console.log(e);
  }
});

function handleStream(stream) {
  const video = document.querySelector('video');
  video.srcObject = stream;
  video.onloadedmetadata = (e) => video.play();
}

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('screenshot', {
  getWindow: async () => {
    const result = await ipcRenderer.invoke('get-window');
    return result;
  },
  getWindowThumbnail: async () => {
    const result = await ipcRenderer.invoke('get-window-thumbnail');
    return result;
  },
  setSource: async (sourceId) => {
    try {
      console.log(sourceId);
      console.log('sdadada');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
            maxFrameRate: 60, // FPSを設定
          },
        },
      });
      handleStream(stream);
    } catch (e) {}
  },
});

export type ElectronHandler = typeof electronHandler;
