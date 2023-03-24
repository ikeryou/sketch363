import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class TextItem extends MyDisplay {

  private _inner: HTMLElement;
  public get inner(): HTMLElement {
    return this._inner;
  }

  private _innerPos: Rect = new Rect();
  public get innerPos(): Rect {
    return this._innerPos;
  }

  private _pos: Rect = new Rect();
  public get pos(): Rect {
    return this._pos;
  }

  private _offsetPos: Rect = new Rect();
  public get offsetPos(): Rect {
    return this._offsetPos;
  }


  constructor(opt:any) {
    super(opt)

    Tween.set(this.el, {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    });

    this._inner = this.el.querySelector('p') as HTMLElement;
    this._inner.classList.remove('js-text-org');
    this._inner.classList.add('js-text-item-inner');
    Tween.set(this._inner, {
      position: 'absolute',
      top: 0,
      left: 0,
    })

    if(Util.hit(2)) {
      Tween.set(this._inner, {
        color: Util.randomArr(['#ffff00', '#0000ff'])
      })
    }

    this.useGPU(this._inner);
    this.useGPU(this.el);
  }


  protected _update(): void {
    super._update();

    // const scroll = Scroller.instance.easeVal.y;
    // this._offsetPos.y

    Tween.set(this._inner, {
      x: this._innerPos.x,
      y: this._innerPos.y,
      scale: this._offsetPos.width,
      // transformOrigin: '50% ' + (this._offsetPos.height * 0) + '%'
      transformOrigin: '50% 0%',
      opacity: this._offsetPos.height,
    })

    Tween.set(this.el, {
      x: this._offsetPos.x,
      y: this._offsetPos.y,
      // scaleY: this._offsetPos.width,
    })
  }

  protected _resize(): void {
    super._resize();
  }
}