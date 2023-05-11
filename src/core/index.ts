import { DefaultOptons, TrackerConfig, Options } from "../types/index";
import { createHistory } from "../utils/utils";
const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
export default class Tracker {
  public data: Options;
  constructor (options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.installTracker()
  }
  
  // 初始化
  private initDef ():DefaultOptons {
    window.history['pushState'] = createHistory('pushState')
    window.history['replaceState'] = createHistory('replaceState')
    return <DefaultOptons> {
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    }
  }

  public setUserId <T extends DefaultOptons['uuid']>(uuid: T) {
    this.data.uuid = uuid
  }

  public setExtra <T extends DefaultOptons['extra']>(extra: T) {
    this.data.extra = extra
  }

  /**
   * 自动上报
   * @param mouseEventList 事件
   * @param targetKey key
   * @param data 用户数据
   */
  private captureEvents<T>(mouseEventList:string[], targetKey:string, data?: T) {
    mouseEventList.forEach(event => {
      window.addEventListener(event, () =>{
        this.reportTracker({
          event,
          targetKey,
          data
        })
      })
    })
  }

  // 触发事件
  private installTracker () {
    if (this.data.historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
    }
    if (this.data.hashTracker) {
      this.captureEvents(['hashchange'], 'hash-pv')
    }
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    if (this.data.jsError) {
      this.jsError()
    }
  }

  /**
   * 上报
   * @param data 用户数据
   */
  private reportTracker <T>(data: T) {
    const params = Object.assign(this.data, data, { time: new Date().getTime() })
    let headers = {
      type: 'application/x-www-form-urlencoded'
    }
    let blob = new Blob([JSON.stringify(params)], headers)
    navigator.sendBeacon(this.data.requestUrl, blob)
  }

  // dom上报
  private targetKeyReport () {
    MouseEventList.forEach(ev => {
      window.addEventListener(ev, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.getAttribute('target-key')
        if (targetKey) {
          this.reportTracker({
            event: ev,
            targetKey
          })
        }
      })
    })
  }

  // 错误上报
  private jsError () {
    this.errorEvent()
    this.promiseReject()
  }

  // js代码错误上报
  private errorEvent () {
    window.addEventListener('error', (e) => {
      this.reportTracker({
        event: 'error',
        targetKey: 'message',
        message: e.message
      })
    })
  }

  // promise错误上报
  private promiseReject () {
    window.addEventListener('unhandledrejection', (event) => {
      event.promise.catch((error) => {
        this.reportTracker({
          event: 'promise',
          targetKey: 'message',
          message: error
        })
      })
    })
  }

  /**
   * 用户手动上报
   * @param data 用户数据
   */
  public sendTracker<T>(data: T) {
    this.reportTracker(data)
  }
}