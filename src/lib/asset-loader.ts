/**
 * 资源预加载工具 (AssetLoader)
 * 作用：在后台静默加载背景图、立绘和音频，确保玩家在切换场景时能获得即时的视觉刷新。
 */

class AssetPreloader {
  private static instance: AssetPreloader;
  private loadedAssets: Set<string> = new Set();
  private loadingQueue: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): AssetPreloader {
    if (!AssetPreloader.instance) {
      AssetPreloader.instance = new AssetPreloader();
    }
    return AssetPreloader.instance;
  }

  /**
   * 预加载一组图片
   * @param urls 图片 URL 数组
   */
  public preloadImages(urls: string[]) {
    urls.forEach(url => {
      if (this.loadedAssets.has(url) || this.loadingQueue.has(url) || !url) return;
      
      this.loadingQueue.add(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.loadedAssets.add(url);
        this.loadingQueue.delete(url);
        // console.log(`[AssetLoader] Preloaded Image: ${url}`);
      };
      img.onerror = () => {
        this.loadingQueue.delete(url);
        console.warn(`[AssetLoader] Failed to preload image: ${url}`);
      };
    });
  }

  /**
   * 预加载一组音频
   * @param urls 音频 URL 数组
   */
  public preloadAudio(urls: string[]) {
    urls.forEach(url => {
      if (this.loadedAssets.has(url) || this.loadingQueue.has(url) || !url) return;

      this.loadingQueue.add(url);
      const audio = new Audio();
      audio.src = url;
      audio.preload = "auto";
      
      const onCanPlay = () => {
        this.loadedAssets.add(url);
        this.loadingQueue.delete(url);
        audio.removeEventListener('canplaythrough', onCanPlay);
        // console.log(`[AssetLoader] Preloaded Audio: ${url}`);
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.load();
    });
  }

  /**
   * 根据当前场景预测并载入下一批资源
   * 核心逻辑：扫描当前场景的所有分支选项，提前加载后续可能出现的场景图片
   */
  public preloadNextAssets(allScenes: Record<string, any>, currentSceneId: string) {
    const currentScene = allScenes[currentSceneId];
    if (!currentScene) return;

    const urlsToPreload: string[] = [];

    // 1. 加载当前场景可能包含的图片资源
    if (currentScene.image) urlsToPreload.push(currentScene.image);

    // 2. 加载当前所有选项指向的场景图片
    if (currentScene.choices) {
      currentScene.choices.forEach((choice: any) => {
        const nextScene = allScenes[choice.nextScene];
        if (nextScene && nextScene.image) {
          urlsToPreload.push(nextScene.image);
        }
      });
    }

    // 3. 处理 Event 模式下的后续 stage 图片
    if (currentScene.event && currentScene.event.stages) {
      Object.values(currentScene.event.stages).forEach((stage: any) => {
        if (stage.image) urlsToPreload.push(stage.image);
      });
    }

    this.preloadImages(urlsToPreload);
  }
}

export const assetLoader = AssetPreloader.getInstance();
