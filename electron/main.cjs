const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin";

let mainWindow;
let viteProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    title: "弹幕盯屏工具",
    backgroundColor: "#0A0C12",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    const tryLoad = (retries = 0) => {
      mainWindow
        .loadURL("http://localhost:5174")
        .then(() => {
          mainWindow.show();
          mainWindow.webContents.openDevTools({ mode: "detach" });
        })
        .catch(() => {
          if (retries < 30) {
            setTimeout(() => tryLoad(retries + 1), 1000);
          } else {
            mainWindow.show();
          }
        });
    };
    tryLoad();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html")).then(() => {
      mainWindow.show();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

function createMenu() {
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "文件",
      submenu: [
        {
          label: "新建盯屏",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            if (mainWindow) mainWindow.webContents.send("navigate", "/");
          },
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "视图",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "窗口",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [{ type: "separator" }, { role: "front" }]
          : [{ role: "close" }]),
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (viteProcess) {
    viteProcess.kill();
    viteProcess = null;
  }
  if (!isMac) app.quit();
});

app.on("before-quit", () => {
  if (viteProcess) {
    viteProcess.kill();
    viteProcess = null;
  }
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
