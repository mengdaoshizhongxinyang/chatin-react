class Container<T extends unknown = unknown>{

}

class Node<T extends unknown = unknown>{
  constructor(private _value: T) { }
  next: Node<T> | null = null
  private valueOf() {
    return this._value === undefined ? 0 : this._value
  }
}
class Vec<T = any>{
  private list: Node<T>[] = []
  private beginNode: Node = new Node(undefined)
  private endNode: Node = new Node(undefined)
  constructor() { }

  at(index: number) {
    if (this.list.length <= index) {
      throw new Error("out of range")
    } else {
      return (this.list[index] as any).valueOf() as unknown as T
    }
  }
  back(): T {
    return (this.list[this.list.length - 1] as any)?.valueOf()
  }
  front(): T {
    return (this.list[0] as any).valueOf()
  }
  //TODO
  // swap(vec:Vector<T>){
  //     const p=new Proxy(vec,{});
  // }
  push_back(value: T) {
    const node = new Node(value)
    this.list.push(new Node(value))
  }
  pop_back() {
    this.list.pop()
  }
  empty() {
    return this.list.length === 0
  }
  insert(val: T, pos: number) {
    if (pos >= this.list.length && pos < 0) {
      throw new Error("out of range")
    } else {
      const node = new Node(val)
      if (pos == 0) {
        this.begin().next = node
        node.next = this.list[0]
      } else {
        this.list[pos - 1].next = node
        node.next = this.list[pos]
      }
      this.list.splice(pos, 0, node);
    }
  }
  begin() {
    return this.beginNode;
  }
  lower_bound(val: T) {
    let left = 0, right = this.list.length - 1;
    while (left < right) {
      let mid = Math.floor((left + right / 2));
      if (((this.list[mid] as any).valueOf()) >= val) {
        right = mid;
      } else {
        left = mid + 1
      }
    }
    return left
  }
  end() {
    return this.endNode
  }
}
export type Vector<T = any> = {
  [key in keyof Vec<T>]: Vec<T>[key]
} & {
    [key in number]: T
  }
export function vector<T = any>() {
  return new Proxy(new Vec<T>(), {
    get: (target, prop) => {
      if (typeof prop != 'symbol') {
        let index = Number(prop)
        if (prop == index.toString()) {
          return target.at(index)
        } else {
          return target[prop as keyof Vec<T>]
        }
      }
    }
  }) as unknown as Vector<T>
}

class PriorityQueue<T extends unknown = number>{
  constructor(private cmp: (lhs: T, rhs: T) => number) { }
  private list: T[] = []
  push() {
    this.list.push
  }
}

export function priority_queue<T = number>(sort: (lhs: T, rhs: T) => number = (lhs, rhs) => { return ((lhs as unknown as number) - (rhs as unknown as number)) }) {
  return new PriorityQueue(sort)
}