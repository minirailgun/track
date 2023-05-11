import { DefaultOptons, TrackerConfig, Options } from "../types/index";
import { createHistory } from "../utils/utils";
export default class Tracker {
  public data: Options;
  constructor (options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.installTracker()
  }
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

  private captureEvents<T>(mouseEventList:string[], targetKey:string, data?: T) {
    mouseEventList.forEach(event => {
      window.addEventListener(event, () =>{
        console.log('监听ing')
      })
    })
  }

  private installTracker () {
    if (this.data.historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv')
    }
    if (this.data.hashTracker) {
      this.captureEvents(['hashchange'], 'hash-pv')
    }
  }
  
}