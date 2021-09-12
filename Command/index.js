// 命令执行者
class CommandAction {
  constructor(ctx) {
    this.ctx = ctx
  }
  // 描边矩形
  strokeRect(x1, y1, x2, y2) {
    this.ctx.strokeRect(x1, y1, x2, y2)
  }

  // 填充矩形
  fillRext(x1, y1, x2, y2) {
    this.ctx.fillRect(x1, y1, x2, y2)
  }

}

// 命令发起者
class ViewCommand {
  constructor(params) {
    if (!this instanceof ViewCommand) {
      throw Error('必须使用 new 方式调用')
    }
    this._init(params)
  }

  _init(container) {
    if (typeof container === 'string') {
      this.container = document.querySelector(container);
    } else {
      this.container = container
    }
    if (!this.container) {
      throw Error('容器元素不能为空')
    }
    const { offsetWidth , offsetHeight } = this.container
    const ctx = this.getCtx(offsetWidth, offsetHeight)
    // TODO: 可以把action 做成插件形式，让用户自定义注册插进
    ViewCommand.action = new CommandAction(ctx)
  }

  getCtx(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width || 400
    canvas.height = height || 400
    this.container.appendChild(canvas);
    return canvas.getContext("2d");
  }

  excute(msg) {
    if (!msg) return
    if (Array.isArray(msg)) {
      msg.forEach(item => {
        this.excute(item)
      })
    } else {
      msg.params = Array.isArray(msg.params) ? msg.params : [msg.params]
      ViewCommand.action[msg.command].apply(ViewCommand.action, msg.params)
    }
  }
}

window.onload = function () {
  var viewCommand = new ViewCommand('#canvas-container')

  const commandIpt = document.getElementById("cammand-input");

  commandIpt.addEventListener("keydown", function (ev) {
    const keyCode = ev.keyCode;
    if (keyCode === 13) {
      parseCommand(this.value);
      this.value = "";
    }
  });
  
 // fillRext 20 20 60 60 描边矩形
 // strokeRect 20 20 60 60 填充矩形
  function parseCommand(cmdStr) {
    let [command, ...params] = cmdStr.split(" ");
    params = params.filter(Boolean);
    viewCommand.excute({ command, params })
  }

}
