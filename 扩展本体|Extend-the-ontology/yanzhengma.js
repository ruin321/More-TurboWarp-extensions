(function(Scratch) {
  'use strict';

  const API_URL = 'https://v2.xxapi.cn/api/chineseCaptcha';
  
  class ChineseCaptchaExtension {
    constructor() {
      this.currentCaptchaId = null;
      this.currentCaptchaUrl = null;
      this.verificationStatus = false;
    }
    
    getInfo() {
      return {
        id: 'chinesecaptcha',
        name: '中文验证码',
        color1: '#4CAF50',
        color2: '#388E3C',
        color3: '#2E7D32',
        blocks: [
          {
            opcode: 'getNewCaptcha',
            blockType: Scratch.BlockType.COMMAND,
            text: '获取新的验证码',
            arguments: {}
          },
          {
            opcode: 'showCaptchaImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示验证码图片',
            arguments: {}
          },
          {
            opcode: 'showCaptchaImageWithCancel',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示验证码图片（可取消）',
            arguments: {}
          },
          {
            opcode: 'verifyCaptcha',
            blockType: Scratch.BlockType.COMMAND,
            text: '验证答案 [ANSWER]',
            arguments: {
              ANSWER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '答案'
              }
            }
          },
          {
            opcode: 'resetVerification',
            blockType: Scratch.BlockType.COMMAND,
            text: '重置验证状态',
            arguments: {}
          },
          {
            opcode: 'getCaptchaId',
            blockType: Scratch.BlockType.REPORTER,
            text: '验证码ID',
            arguments: {}
          },
          {
            opcode: 'isVerified',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '验证成功？',
            arguments: {}
          },
          {
            opcode: 'getCaptchaUrl',
            blockType: Scratch.BlockType.REPORTER,
            text: '验证码图片URL',
            arguments: {}
          }
        ],
        menus: {}
      };
    }

    async getNewCaptcha() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.code === 200) {
          this.currentCaptchaId = data.data.id;
          this.currentCaptchaUrl = data.data.url;
          this.verificationStatus = false;
          return true;
        } else {
          throw new Error(data.msg || '获取验证码失败');
        }
      } catch (error) {
        console.error('获取验证码错误:', error);
        return false;
      }
    }

    showCaptchaImage() {
      this._showCaptchaModal(false);
    }

    showCaptchaImageWithCancel() {
      this._showCaptchaModal(true);
    }

    _showCaptchaModal(showCancelButton) {
      if (!this.currentCaptchaUrl) {
        // 在页面内显示错误提示
        this._showInlineError('请先获取验证码');
        return;
      }

      // 创建模态窗口
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        position: relative;
      `;

      const title = document.createElement('h3');
      title.textContent = '中文验证码识别';
      title.style.cssText = `
        margin: 0 0 20px 0;
        color: #333;
        font-size: 24px;
        font-weight: bold;
      `;

      const statusIndicator = document.createElement('div');
      statusIndicator.textContent = this.verificationStatus ? '✓ 已验证' : '未验证';
      statusIndicator.style.cssText = `
        color: ${this.verificationStatus ? '#4CAF50' : '#ff9800'};
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 14px;
      `;

      // 消息提示区域
      const messageArea = document.createElement('div');
      messageArea.id = 'captcha-message';
      messageArea.style.cssText = `
        min-height: 20px;
        margin: 10px 0;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.3s ease;
      `;

      const image = document.createElement('img');
      image.src = this.currentCaptchaUrl;
      image.style.cssText = `
        max-width: 100%;
        height: auto;
        border: 2px solid #ddd;
        border-radius: 8px;
        margin: 10px 0;
        background: #f9f9f9;
        padding: 10px;
      `;

      const inputContainer = document.createElement('div');
      inputContainer.style.cssText = `
        margin: 15px 0;
      `;

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '请输入验证码答案';
      input.style.cssText = `
        width: 100%;
        padding: 12px;
        border: 2px solid #4CAF50;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 10px;
        transition: border-color 0.3s;
      `;

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 15px;
      `;

      const verifyBtn = document.createElement('button');
      verifyBtn.textContent = '验证';
      verifyBtn.style.cssText = `
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: bold;
        flex: 1;
        min-width: 100px;
      `;

      // 显示消息函数
      const showMessage = (message, type = 'info') => {
        messageArea.textContent = message;
        switch (type) {
          case 'error':
            messageArea.style.color = '#f44336';
            messageArea.style.backgroundColor = '#ffebee';
            messageArea.style.padding = '8px';
            messageArea.style.borderRadius = '4px';
            messageArea.style.border = '1px solid #f44336';
            break;
          case 'success':
            messageArea.style.color = '#4CAF50';
            messageArea.style.backgroundColor = '#e8f5e8';
            messageArea.style.padding = '8px';
            messageArea.style.borderRadius = '4px';
            messageArea.style.border = '1px solid #4CAF50';
            break;
          case 'warning':
            messageArea.style.color = '#ff9800';
            messageArea.style.backgroundColor = '#fff3e0';
            messageArea.style.padding = '8px';
            messageArea.style.borderRadius = '4px';
            messageArea.style.border = '1px solid #ff9800';
            break;
          default:
            messageArea.style.color = '#2196F3';
            messageArea.style.backgroundColor = '#e3f2fd';
            messageArea.style.padding = '8px';
            messageArea.style.borderRadius = '4px';
            messageArea.style.border = '1px solid #2196F3';
        }
      };

      // 清除消息函数
      const clearMessage = () => {
        messageArea.textContent = '';
        messageArea.style.backgroundColor = 'transparent';
        messageArea.style.padding = '0';
        messageArea.style.border = 'none';
      };

      // 悬停效果
      verifyBtn.onmouseover = () => verifyBtn.style.background = '#45a049';
      verifyBtn.onmouseout = () => verifyBtn.style.background = '#4CAF50';

      verifyBtn.onclick = async () => {
        const answer = input.value.trim();
        if (!answer) {
          showMessage('请输入验证码答案', 'warning');
          input.style.borderColor = '#ff9800';
          return;
        }

        // 清除之前的消息和样式
        clearMessage();
        input.style.borderColor = '#4CAF50';

        verifyBtn.disabled = true;
        verifyBtn.textContent = '验证中...';
        verifyBtn.style.background = '#999';

        showMessage('正在验证，请稍候...', 'info');

        try {
          const verified = await this.verifyAnswer(answer);
          if (verified) {
            this.verificationStatus = true;
            statusIndicator.textContent = '✓ 已验证';
            statusIndicator.style.color = '#4CAF50';
            showMessage('验证成功！✓', 'success');
            
            // 2秒后自动关闭
            setTimeout(() => {
              modal.remove();
            }, 2000);
          } else {
            showMessage('验证失败，请重新输入', 'error');
            input.style.borderColor = '#f44336';
            input.value = '';
            input.focus();
          }
        } catch (error) {
          showMessage('验证出错: ' + error.message, 'error');
          input.style.borderColor = '#f44336';
        } finally {
          verifyBtn.disabled = false;
          verifyBtn.textContent = '验证';
          verifyBtn.style.background = '#4CAF50';
        }
      };

      // 只在需要时显示取消按钮
      if (showCancelButton) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
          background: #f44336;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
          font-weight: bold;
          flex: 1;
          min-width: 100px;
        `;

        cancelBtn.onmouseover = () => cancelBtn.style.background = '#da190b';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#f44336';

        cancelBtn.onclick = () => {
          modal.remove();
        };

        buttonContainer.appendChild(verifyBtn);
        buttonContainer.appendChild(cancelBtn);
      } else {
        // 不显示取消按钮时，验证按钮占满宽度
        verifyBtn.style.flex = '1';
        verifyBtn.style.minWidth = '100%';
        buttonContainer.appendChild(verifyBtn);
        
        // 不显示取消按钮时，点击模态窗口外部不能关闭
        modal.onclick = null;
      }

      // 输入框事件
      input.onfocus = () => {
        clearMessage();
        input.style.borderColor = '#2196F3';
      };

      input.oninput = () => {
        if (input.value.trim()) {
          input.style.borderColor = '#4CAF50';
          clearMessage();
        }
      };

      // 按回车键验证
      input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          verifyBtn.click();
        }
      };

      // 组装元素
      inputContainer.appendChild(input);
      content.appendChild(title);
      content.appendChild(statusIndicator);
      content.appendChild(messageArea);
      content.appendChild(image);
      content.appendChild(inputContainer);
      content.appendChild(buttonContainer);
      modal.appendChild(content);

      document.body.appendChild(modal);

      // 只在显示取消按钮时允许点击外部关闭
      if (showCancelButton) {
        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        };
      }

      // 自动聚焦输入框
      setTimeout(() => input.focus(), 100);
    }

    _showInlineError(message) {
      // 在页面内显示错误提示
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
      `;
      
      // 添加动画样式
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideDown {
          from { top: -50px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      errorDiv.textContent = message;
      document.body.appendChild(errorDiv);
      
      // 3秒后自动移除
      setTimeout(() => {
        errorDiv.remove();
        style.remove();
      }, 3000);
    }

    async verifyAnswer(answer) {
      if (!this.currentCaptchaId) {
        throw new Error('没有可用的验证码ID');
      }

      const params = new URLSearchParams({
        type: 'verify',
        id: this.currentCaptchaId,
        answer: answer
      });

      try {
        const response = await fetch(`${API_URL}?${params}`);
        const data = await response.json();
        
        return data.code === 200;
      } catch (error) {
        console.error('验证错误:', error);
        return false;
      }
    }

    async verifyCaptcha(args) {
      const result = await this.verifyAnswer(args.ANSWER);
      if (result) {
        this.verificationStatus = true;
      }
      return result;
    }

    resetVerification() {
      this.verificationStatus = false;
    }

    getCaptchaId() {
      return this.currentCaptchaId || '暂无ID';
    }

    isVerified() {
      return !!this.verificationStatus;
    }

    getCaptchaUrl() {
      return this.currentCaptchaUrl || '';
    }
  }

  Scratch.extensions.register(new ChineseCaptchaExtension());
})(Scratch);