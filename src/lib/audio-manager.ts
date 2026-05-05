/**
 * 音频管理器 (AudioManager)
 * 作用：处理背景音乐(BGM)的平滑切换、淡入淡出，避免声音突变带来的违和感。
 */

class BGMManager {
  private static instance: BGMManager;
  // 使用两个音频对象进行交叉淡入淡出 (Node A 和 Node B)
  private audioNodes: [HTMLAudioElement, HTMLAudioElement];
  private playPromises: [Promise<void> | null, Promise<void> | null] = [null, null];
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
    
    // 忽略占位符或无效 URL
    if (!url || url.includes("base64")) {
      this.stop(fadeDuration);
      return;
    }

    this.currentUrl = url;

    const oldNodeIndex = this.activeNodeIndex;
    const oldNode = this.audioNodes[oldNodeIndex];
    
    this.activeNodeIndex = 1 - this.activeNodeIndex; // 切换到另一个节点
    const newNodeIndex = this.activeNodeIndex;
    const newNode = this.audioNodes[newNodeIndex];

    // 清除上一次未完成的淡入淡出任务
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // 记录旧节点当前的音量，作为淡出的起点
    const startOldVol = oldNode.volume;
    const startTime = Date.now();

    // 准备新节点
    newNode.src = url;
    newNode.volume = 0;
    
    // 立即启动淡入淡出定时器，不再等待 play() 的 Promise
    // 这样旧节点可以立即开始变小声
    this.fadeInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // 新节点淡入 (基于 baseVolume)
      newNode.volume = progress * this.baseVolume;
      // 旧节点淡出
      oldNode.volume = (1 - progress) * startOldVol;

      if (progress >= 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        
        // 安全停止并重置旧节点
        try {
          oldNode.pause();
          oldNode.src = ""; 
          oldNode.load(); // 强制清除缓存资源
        } catch (e) {
          // 忽略
        }
      }
    }, 50);

    try {
      // 启动新节点播放
      const p = newNode.play();
      this.playPromises[newNodeIndex] = p;
      await p;
    } catch (err) {
      console.warn("AudioManager Play Interrupted:", url);
    }
  }

  /**
   * 停止当前音乐（淡出后停止）
   */
  public stop(fadeDuration: number = 1000) {
    if (!this.currentUrl) return;
    
    const activeIndex = this.activeNodeIndex;
    const activeNode = this.audioNodes[activeIndex];
    const startVol = activeNode.volume;
    const startTime = Date.now();

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.currentUrl = null;

    this.fadeInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      activeNode.volume = (1 - progress) * startVol;

      if (progress >= 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        
        try {
          if (this.playPromises[activeIndex]) {
            await this.playPromises[activeIndex];
          }
          activeNode.pause();
          activeNode.src = "";
        } catch (e) {
          // 忽略
        }
      }
    }, 50);
  }
}

export const audioManager = BGMManager.getInstance();
