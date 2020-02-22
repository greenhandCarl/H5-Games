export interface Word {
  id: number;
  name: string;
  img?: string;
  left?: string;
  top?: string;
  isCorrect: boolean;
}

export interface Config {
  isHorizontal: boolean; // 是否横屏
  startPlay: boolean; // 开始游戏状态
  playTime: number; // 游戏时长,单位ms
  isFirst?: boolean; // 是否第一次玩，第一次是导学
}

export interface Result {
  correct: number;
  total: number;
  gameStatus: number; // 1: 开始; 2: 成功；3：失败
  correctWord?: string; // 正确的单词
}

export interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function getElementPosition (target: HTMLElement): Position {
  const pos: Position = {
    x: target.offsetLeft,
    y: target.offsetTop,
    w: target.offsetWidth,
    h: target.offsetHeight
  }
  let offsetTarget = target.offsetParent as HTMLElement
  // 当元素为body时，其parent为null
  while (offsetTarget) {
    pos.x += offsetTarget.offsetLeft
    pos.y += offsetTarget.offsetTop
    offsetTarget = offsetTarget.offsetParent as HTMLElement
  }
  return pos
}
