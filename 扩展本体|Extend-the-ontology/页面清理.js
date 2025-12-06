(function(Scratch) {
  'use strict';
  
  class PageCleanerExtension {
    getInfo() {
      return {
        id: 'pagecleaner',
        name: '页面清理器',
        blocks: [
          {
            opcode: 'clearAllElements',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除页面上所有元素'
          },
          {
            opcode: 'clearExceptStage',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除舞台外所有元素'
          },
          {
            opcode: 'clearWithStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除所有元素并设置背景色[COLOR]',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'black'
              }
            }
          },
          {
            opcode: 'fadeOutAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '淡出所有元素'
          },
          {
            opcode: 'showURL',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示网址[URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              }
            }
          },
          {
            opcode: 'showHTML',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示HTML代码[HTML]',
            arguments: {
              HTML: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<h1 style="color: red;">Hello World!</h1>'
              }
            }
          },
          {
            opcode: 'showIframe',
            blockType: Scratch.BlockType.COMMAND,
            text: '在iframe中显示网址[URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              }
            }
          },
          {
            opcode: 'showText',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示文本[TEXT]颜色[COLOR]大小[SIZE]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World'
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'white'
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 24
              }
            }
          },
          {
            opcode: 'restorePage',
            blockType: Scratch.BlockType.COMMAND,
            text: '恢复页面'
          }
        ]
      };
    }
    
    clearAllElements() {
      try {
        if (!this.originalHTML) {
          this.originalHTML = document.documentElement.innerHTML;
        }
        document.body.innerHTML = '';
        
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => {
          if (!style.href || !style.href.includes('scratch')) {
            style.remove();
          }
        });
        
      } catch (error) {
        console.error('清除元素时出错:', error);
      }
    }
    
    clearExceptStage() {
      try {
        if (!this.originalHTML) {
          this.originalHTML = document.documentElement.innerHTML;
        }
        
        const stageSelectors = [
          '[class*="stage"]',
          '[class*="game"]',
          '.stage-wrapper',
          '#stage',
          '.gui'
        ];
        
        let stageElement = null;
        for (const selector of stageSelectors) {
          stageElement = document.querySelector(selector);
          if (stageElement) break;
        }
        
        if (stageElement) {
          document.body.innerHTML = '';
          document.body.appendChild(stageElement);
          stageElement.style.width = '100vw';
          stageElement.style.height = '100vh';
          stageElement.style.margin = '0';
          stageElement.style.padding = '0';
        } else {
          this.clearAllElements();
        }
        
      } catch (error) {
        console.error('清除舞台外元素时出错:', error);
      }
    }
    
    clearWithStyle(args) {
      try {
        this.clearAllElements();
        const color = Scratch.Cast.toString(args.COLOR);
        
        document.body.style.backgroundColor = color;
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        
      } catch (error) {
        console.error('设置背景色时出错:', error);
      }
    }
    
    fadeOutAll() {
      try {
        if (!this.originalHTML) {
          this.originalHTML = document.documentElement.innerHTML;
        }
        
        const allElements = document.body.getElementsByTagName('*');
        for (let element of allElements) {
          element.style.transition = 'opacity 2s ease-in-out';
          element.style.opacity = '0';
        }
        
        setTimeout(() => {
          this.clearAllElements();
        }, 2000);
        
      } catch (error) {
        console.error('淡出效果出错:', error);
      }
    }
    
    showURL(args) {
      try {
        this.clearAllElements();
        const url = Scratch.Cast.toString(args.URL);
        
        // 重定向到指定网址
        window.location.href = url;
        
      } catch (error) {
        console.error('显示网址时出错:', error);
        alert('无法跳转到指定网址: ' + error.message);
      }
    }
    
    showHTML(args) {
      try {
        this.clearAllElements();
        const html = Scratch.Cast.toString(args.HTML);
        
        // 设置全屏样式
        document.body.style.margin = '0';
        document.body.style.padding = '20px';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'auto';
        document.body.style.backgroundColor = 'white';
        
        // 插入HTML代码
        document.body.innerHTML = html;
        
      } catch (error) {
        console.error('显示HTML时出错:', error);
      }
    }
    
    showIframe(args) {
      try {
        this.clearAllElements();
        const url = Scratch.Cast.toString(args.URL);
        
        // 设置全屏样式
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        
        // 创建全屏iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        
        document.body.appendChild(iframe);
        
      } catch (error) {
        console.error('显示iframe时出错:', error);
      }
    }
    
    showText(args) {
      try {
        this.clearAllElements();
        const text = Scratch.Cast.toString(args.TEXT);
        const color = Scratch.Cast.toString(args.COLOR);
        const size = Scratch.Cast.toNumber(args.SIZE);
        
        // 设置全屏居中样式
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.backgroundColor = 'black';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        
        // 创建文本元素
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.color = color;
        textElement.style.fontSize = size + 'px';
        textElement.style.fontFamily = 'Arial, sans-serif';
        textElement.style.textAlign = 'center';
        
        document.body.appendChild(textElement);
        
      } catch (error) {
        console.error('显示文本时出错:', error);
      }
    }
    
    restorePage() {
      try {
        if (this.originalHTML) {
          document.documentElement.innerHTML = this.originalHTML;
          this.originalHTML = null;
        }
      } catch (error) {
        console.error('恢复页面时出错:', error);
      }
    }
  }
  
  if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new PageCleanerExtension());
  }
})(Scratch);