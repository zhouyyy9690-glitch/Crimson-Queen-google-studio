/**
 * 音频管理器 (AudioManager)
 * 作用：处理背景音乐(BGM)的平滑切换、淡入淡出，避免声音突变带来的违和感。
 */

class BGMManager {
  private static instance: BGMManager;
  // 使用两个音频对象进行交叉淡入淡出 (Node A 和 Node B)
  private audioNodes: [HTMLAudioElement, HTMLAudioElement];
  private activeNodeIndex: number = 0;
  private fadeInterval: any = null;
  private currentUrl: string | null = null;
  private baseVolume: number = 0.4; // 游戏设置的基础音量

  private constructor() {
    this.audioNodes = [new Audio(), new Audio()];
    this.audioNodes.forEach(node => {
      node.loop = true;
      node.volume = 0;
    });
  }

  public static getInstance(): BGMManager {
    if (!BGMManager.instance) {
      BGMManager.instance = new BGMManager();
    }
    return BGMManager.instance;
  }

  /**
   * 设置全局基础音量（由 UI 滑块控制）
   */
  public setBaseVolume(volume: number) {
    this.baseVolume = volume;
    // 实时更新当前正在播放的节点音量
    const activeNode = this.audioNodes[this.activeNodeIndex];
    if (!activeNode.paused && !this.fadeInterval) {
      activeNode.volume = volume;
    }
  }

  /**
   * 播放音乐（带有平滑切换效果）
   * @param url 音乐文件的 URL
   * @param fadeDuration 淡入淡出时长 (毫秒)
   */
  public async play(url: string, fadeDuration: number = 1500) {
    if (this.currentUrl === url) return; // 已经在播放同个曲目，忽略
    this.currentUrl = url;

    const oldNode = this.audioNodes[this.activeNodeIndex];
    this.activeNodeIndex = 1 - this.activeNodeIndex; // 切换到另一个节点
    const newNode = this.audioNodes[this.activeNodeIndex];

    // 清除上一次未完成的淡入淡出任务
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    // 准备新节点
    newNode.src = url;
    newNode.volume = 0;
    
    try {
      await newNode.play();
      
      const startTime = Date.now();
      const startOldVol = oldNode.volume;
      
      this.fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);

        // 新节点淡入
        newNode.volume = progress * this.baseVolume;
        // 旧节点淡出
        oldNode.volume = (1 - progress) * startOldVol;

        if (progress >= 1) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          oldNode.pause();
          oldNode.src = ""; // 释放资源
        }
      }, 50);
    } catch (err) {
      console.error("AudioManager Play Error:", err);
    }
  }

  /**
   * 停止当前音乐（淡出后停止）
   */
  public stop(fadeDuration: number = 1000) {
    if (!this.currentUrl) return;
    
    const activeNode = this.audioNodes[this.activeNodeIndex];
    const startVol = activeNode.volume;
    const startTime = Date.now();

    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.currentUrl = null;

    this.fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      activeNode.volume = (1 - progress) * startVol;

      if (progress >= 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        activeNode.pause();
        activeNode.src = "";
      }
    }, 50);
  }
}

export const audioManager = BGMManager.getInstance();
