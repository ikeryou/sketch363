import { MyDisplay } from "../core/myDisplay";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { TextItem } from "./textItem";
import { Util } from "../libs/util";
import { Scroller } from "../core/scroller";
import { Rect } from "../libs/rect";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _parentTxt: HTMLElement;
  private _blocksEl: HTMLElement;

  private _line: number = Func.val(25, 50);
  private _items: Array<TextItem> = [];
  private _order: Array<TextItem> = [];

  private _heightEl: HTMLElement;

  private _txtSize: Rect = new Rect();

  constructor(opt:any) {
    super(opt)

    this._heightEl = document.createElement('div');
    document.body.append(this._heightEl);
    Tween.set(this._heightEl, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 1,
    })

    this._parentTxt = this.qs('.js-text-org') as HTMLElement;
    this._blocksEl = this.qs('.js-text-blocks') as HTMLElement;

    const num = this._line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      b.classList.add('js-text-item');
      this._blocksEl.append(b);
      b.append(this._parentTxt.cloneNode(true));

      const item = new TextItem({
        el: b,
      });
      this._items.push(item);

      this._order.push(item);
    }

    this._updateItemSize();
  }


  private _updateItemSize(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    const fontSize = Math.min(sw, sh) * Func.val(0.1, 0.15);
    Tween.set(this._parentTxt, {
      fontSize:  fontSize,
    });

    const txtSize = this.getRect(this._parentTxt);
    const txtWidth = txtSize.width;
    const txtHeight = txtSize.height;

    this._txtSize.width = txtWidth;
    this._txtSize.height = txtHeight;

    // console.log(txtWidth, txtHeight);

    const blockWidth = txtWidth;
    const blockHeight = txtHeight / this._line;

    Tween.set(this._parentTxt, {
      x: sw * 0.5 - txtWidth * 0.5,
      y: sh * 0.5 - txtHeight * 0.5,
    })

    this._items.forEach((val,i) => {
      const key = i;

      const iy = ~~(key % this._line);
      const ix = 0;

      const x = ix * blockWidth + sw * 0.5 - txtWidth * 0.5;
      const y = iy * blockHeight + sh * 0.5 - txtHeight * 0.5

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        left: x,
        top: y,
        opacity: 1,
      })

      Tween.set(val.inner, {
        // x: -ix * blockWidth,
        // y: -iy * blockHeight,
        fontSize: fontSize,
      })

      val.pos.width = blockWidth;
      val.pos.x = x + blockWidth * 0.5;
      val.pos.y = y + blockHeight * 0.5;

      val.innerPos.x = -ix * blockWidth;
      val.innerPos.y = -iy * blockHeight;

      // val.offsetPos.height = Math.abs((val.innerPos.y + 0) / txtHeight);
    })
  }

  protected _update(): void {
    super._update();

    const allHeight = Func.sh() * Func.val(2, 5);
    Tween.set(this._heightEl, {
      height: allHeight
    });

    const s = Scroller.instance.easeVal.y;
    const maxScrl = allHeight - Func.sh();
    const it = maxScrl / this._items.length;
    const range = this._txtSize.width * 0.15;
    const ease = 0.1;

    this._items.forEach((val,i) => {
      const start = Math.max(0, it * i - it);
      const r = Util.map(s, 0, 1, start, start + it * 2);

      // const x = Util.map(r, range, -range, 0, 1);
      const y = Util.map(r, range * 0, -0, 0, 1);
      const scale = Util.map(r, 3, 1, 0, 1);

      val.offsetPos.x = Math.sin(Util.radian(Util.map(r, 0, 360, 0, 1))) * range * 1.5
      val.offsetPos.y += (y - val.offsetPos.y) * ease;
      val.offsetPos.width += (scale - val.offsetPos.width) * ease;
      val.offsetPos.height += (Util.map(r, 0, 1, 0, 0.05) - val.offsetPos.height) * ease;
    });

    if(this._c % 30 == 0) {
      this._updateItemSize();
    }
  }

  protected _resize(): void {
    super._resize();
  }
}