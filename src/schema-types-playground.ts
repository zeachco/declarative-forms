interface LabelDictionnary {
  [key: string]: string | LabelDictionnary;
}

export interface SchemaNodeServerDefinition {
  type?: string | string[] | { polymorphic: string[] };
  watch?: string;
  value?: any;
  labels?: LabelDictionnary;
  attributes?: Record<string, SchemaNodeServerDefinition>;
  validators?: any[];
  meta?: any;
  options?: string[];
}

type t4 = Prefix<NonNullable<keyof SchemaNodeServerDefinition>, ''>
type t5 = Defix<t4>

type NS = "$";
type BaseProps = Omit<SchemaNodeServerDefinition, "attributes">;
type Prefix<
  P extends string | number | symbol,
  N extends string = NS
> = P extends string ? `${N}${P}` : never;
type Defix<
  P extends string | number | symbol,
  N extends string = NS
> = P extends `${N}${infer O}` ? O : P;

type PrefixInterface<
  Base extends object,
  N extends string = NS,
  Merged extends Base & { [key: string]: Base } = Base & {
    [key: string]: Base;
  },
  Keys extends keyof Base = keyof Base,
  PossibleKeys extends Prefix<keyof Base> | keyof Merged =
    | Prefix<keyof Base>
    | keyof Merged
> = {
  [K in PossibleKeys]: Defix<K> extends PossibleKeys ? "m" : "f";
};
type T7 = PrefixInterface<BaseProps>;

type T8 = T7["__type2"];

const a: T7 = {
  __type: { polymorphic: [] },
  __labels: {},
  __value: "",
  __watch: "",
  aaa: {
    __type: { polymorphic: [] },
    __labels: {},
    __value: "",
    __watch: "",
  },
};

type NodeGRoup = PrefixInterface<BaseProps> & { [key: string]: PProps };
type Leaf = PrefixInterface<BaseProps>;
type PProps = NodeGRoup | Leaf;

// type Schema3 = Record<string, PrefixInterface> & {[key:string]:Schema3 | PrefixInterface}

type LoseRecord<Base extends object = {}> = {
  [key: string]: LoseRecord<Base>;
} & Base;

type Schema<N extends string = NS, T extends object = {}> = {
  [key: string]:
    | (PrefixInterface<N> & { [K in keyof T]: Schema<N, any> })
    | PrefixInterface<N>;
};

type Schema2<
  O extends object,
  CK extends keyof O = keyof O
> = PrefixInterface & {
  [K in CK & keyof PrefixInterface]: K extends CK ? CK : PrefixInterface;
};

type Sche = PrefixInterface | { [key: string]: Sche };

const test: Schema3 = {
  // __watch: '',
  test: {
    __type: "test",
    aaa: {
      __type: "",
      aaa: {
        __type: "test",
        __options: [],
      },
    },
  },
};

interface AAA {
  a: {
    b: {
      c: {
        d: number;
      };
    };
  };
}

const test2: Schema = {
  asadad: {
    type: "",
    aasdasd: {
      options: [],
      aaaa: {
        type: "",
      },
    },
  },
};

type normal = NonNullable<keyof BaseProps | "test">; // "type"   | "value"   | "test"
type $normal = Prefix<normal, "$">; // "$value" | "$type"   | "$test"
type _normal = Prefix<normal, "_">; // "_type"  | "_value"  | "_test"
type back = Defix<_normal | "should_not_show", "_">; // "type"   | "value"   | "test"

interface CustomRules {
  html?: { code: string };
  svg?: { paths: string[] };
  image?: string;
}

interface RGB {
  rgb: {
    red: number;
    green: number;
    blue: number;
  };
}

interface HSL {
  hsl: {
    hue: number;
    saturation: number;
    lightness: number;
  };
}

interface Hex {
  hex: {
    hexCode: string;
  };
}

interface Custom {
  custom?: CustomRules[];
}

type SchemaData =
  | { color: RGB }
  | { color: HSL }
  | { color: Hex }
  | { color: Custom };

// const structure: SchemaData = {
//   color: {
//     rgb: {
//       blue: 0,
//       green: 0,
//       red: 0,
//     },
//     hex: {
//       hexCode: '#ffffff'
//     }
//   }
// }

// type Trim<S extends string> =
//     S extends ` ${infer T}` ? Trim<T> :
//     S extends `${infer T} ` ? Trim<T> :
//     S;

// type T10 = Trim<' a'>

type IsKnownKey<Key, N extends string = NS> = Key extends `${N}${infer T}`
  ? true
  : false;

type T1 = IsKnownKey<"__test">;
type T3 = Defix<"__test">;

type DeclarativeStructure<
  BaseObj,
  CustomObj,
  AllKeys extends Prefix<keyof BaseObj> | keyof CustomObj =
    | Prefix<keyof BaseObj>
    | keyof CustomObj
> = {
  [K in AllKeys]: IsKnownKey<K> extends true
    ? Defix<K> extends keyof BaseObj
      ? BaseObj[Defix<K>]
      : never
    : K extends keyof CustomObj
    ? CustomObj[K] & DeclarativeStructure<BaseObj, CustomObj[K]>
    : never;
};



const sch: DeclarativeStructure<BaseProps, SchemaData> = {
  $type: "group",
  $labels: {},
  $meta: {},
  $options: [],
  $validators: [],
  $value: "",
  // $watch: '',
  color: {
    $type: 'polymorphic',
    $labels: {},
    $meta: {},
    $options: [],
    $validators: [],
    $value: "",
    $watch: "",
    rgb: {

    },
    hex: {
      hexCode: "test",
    },
    hsl: {
      hue: 12,
      lightness: 10,
      saturation: 100,
    },
    custom: [
      {
        html: { code: "" },
      },
    ],
  },
};

console.log(sch);



interface Passport {
  passportNumber: number;
  passportIssuer: number;
}


interface Ssn {
  ssn: number;
}

type Resp = Ssn | Passport



{
  x: {
    a: 1,
    b: 2,
    c: 3
  },
  y: {
    b: 2,
    c: 3
  },
  z: {
    a: 1,
    b: 2
  }
}

{
  ssn: {when: ['!isDirector']}
  age: {when: ['$>18']}
}

[
  {
    type: 'date',
    fieldName: 'date',
    validators: 'date',
    meta: 'date',
    options?: 'date',
    path: "dateA"
  },
  {
    requires: 'dateA'
  }
]



// yaml > controler > graphql > type > react




type BaseNodeStructure = Omit<SchemaNodeServerDefinition, 'attributes'>
type Prefix<P extends string|number|symbol, N extends string> = P extends string ? `${N}${P}` : never;
type Defix<P extends string|number|symbol, N extends string> = P extends `${N}${infer O}` ? O : never;
type NodeStructure<N extends string = "__"> = {
  [K in Prefix<keyof BaseNodeStructure, N>]: BaseNodeStructure[Defix<K, N>]
}


// type Schema<T> = T extends object
//   ? keyof NodeStructure
//   : {[Property in keyof T]: Schema<T[Property]>} & NodeStructure;

type Schema<UD extends object = never>  = {
  [K in keyof UD | keyof NodeStructure]: K extends UD ? Schema<UD> : never
}

interface CustomRules {
  html: {code:string};
  svg: {paths: string[]};
  image: string;
}

type Polymorphic<O, OneKey extends string =  keyof O> = {
  [K in keyof O]: Record<K, O[K]>;
}

interface SchemaData {
  color: Polymorphic<{
    rgb: {
      red:number,
      green:number,
      blue:number,
    },
    hsl: {
      hue:number,
      saturation:number,
      lightness:number
    },
    hex: {
      hexCode:string
    },
    custom?: CustomRules[]
  }>
}


const newSchema: Schema = {
 aaaa: {

 }
}

function schemaFrom<T extends string = '$'>(schema: Schema<T> = {}, prefix: T = '$') {
  return {} as SchemaNodeDefinition;
}

schemaFrom({
  entity: {
    owners: {
      _type: [],
      // firstName: {$validators: [{name: 'Presence'}]},
      // lastName: {$validators: [{name: 'Presence'}]},
      age: {_type: 'integer'},
      address: {
        street: {},
        state: {},
        zip: {},
        country: {}
      }
    }
  }
})
