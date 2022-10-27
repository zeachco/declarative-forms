import {ssnPassportSchema} from './fixtures';
import {setup} from './utilities';

describe('Setting polymorphic node initial values nested under a list node', () => {
  const schema = ssnPassportSchema;
  it('Sets initial polymorphic value from parent nodes', () => {
    const {root} = setup({schema});

    expect(
      root.children.equity_details.children.equityOwnersList.value,
    ).toHaveLength(2);

    const [
      alf,
      bob,
    ] = root.children.equity_details.children.equityOwnersList.value;

    const alfVariant = alf.children.ssnOrPassport;
    const bobVariant = bob.children.ssnOrPassport;

    expect(alfVariant.value).toBe('variantPassport');
    expect(bobVariant.value).toBe('variantSsn');

    expect(alfVariant.data()).toStrictEqual({
      passport: {
        passportId: 'ginghihnihnhn',
        country: 'US',
      },
      ssnOrPassportType: 'variantPassport',
    });

    expect(bobVariant.data()).toStrictEqual({
      ssn: '****1111',
      ssnOrPassportType: 'variantSsn',
    });
  });

  xit('get/set with remote store', () => {
    const colorSchema = {
      color: {
        _type: 'polymorphic',
        _value: 'hex',
        rgb: {
          red: {_type: 'number'},
          green: {_type: 'number'},
          blue: {_type: 'number'},
        },
        hsl: {
          hue: {_type: 'number'},
          saturarion: {_type: 'number'},
          light: {_type: 'number'},
        },
        hex: {
            hexcode: {_type: 'string'},
        },
        custom: {
          _type: [],
          _validators: [],
          style: {
            _type: 'polymorphic',
            html: {},
            svg: {},
            css: {},
          }
        }
      }
    };

    const {root} = setup({
      schema: colorSchema,
    });

    console.log(root.data())
    console.log(root.context.data)

    expect(root.children.color.value).toBe('hex')

    expect(root.data()).toStrictEqual({
      color: {
        colorType: 'hex',
        hexcode: '',
      },
    });
  });
});
