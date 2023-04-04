import {SchemaNode} from '../types';
import {
  colorSchema,
  ssnPassportSchema,
  ssnPassportValues,
  invalidSsnPassportValues,
} from './fixtures';
import {setup} from './utilities';

describe('Setting polymorphic node initial values nested under a list node', () => {
  const schema = ssnPassportSchema(ssnPassportValues, true);

  it('sets initial polymorphic value from parent nodes', () => {
    const {root} = setup({schema});

    const {equityOwnersList} = root.children.equity_details.children;

    expect(equityOwnersList.value).toHaveLength(2);
    {
      const [alf, bob] = equityOwnersList.value;

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
    }

    // Add 3rd owner

    const charlie = {
      firstName: 'Charlie',
      lastName: 'Castoni',
      ssnOrPassport: {
        ssnOrPassportType: 'variantPassport',
        passport: {
          passportId: 'ginitititit',
          country: 'IT',
        },
      },
    };

    {
      equityOwnersList.addListItem(charlie);

      const [alf, bob, cha] = equityOwnersList.value;

      const alfVariant = alf.children.ssnOrPassport;
      const bobVariant = bob.children.ssnOrPassport;
      const chaVariant = cha.children.ssnOrPassport;

      expect(alfVariant.value).toBe('variantPassport');
      expect(bobVariant.value).toBe('variantSsn');
      expect(chaVariant.value).toBe('variantPassport');

      expect(chaVariant.data()).toStrictEqual(charlie.ssnOrPassport);
      expect(cha.data()).toStrictEqual(charlie);

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
    }

    // Remove 2nd owner

    {
      equityOwnersList.removeListItem(1);

      const [alf, cha] = equityOwnersList.value;

      const alfVariant = alf.children.ssnOrPassport;
      const chaVariant = cha.children.ssnOrPassport;

      expect(alfVariant.value).toBe('variantPassport');
      expect(chaVariant.value).toBe('variantPassport');

      expect(chaVariant.data()).toStrictEqual(charlie.ssnOrPassport);
      expect(cha.data()).toStrictEqual(charlie);

      expect(alfVariant.data()).toStrictEqual({
        passport: {
          passportId: 'ginghihnihnhn',
          country: 'US',
        },
        ssnOrPassportType: 'variantPassport',
      });

      expect(chaVariant.uid).toBe(
        'equity_details.equityOwnersList.1.ssnOrPassport',
      );
    }
  });

  it('sets the polymorphic node isValid to true if the selected child is valid', () => {
    const schema = ssnPassportSchema(ssnPassportValues);
    const {root} = setup({schema});

    const {equityOwnersList} = root.children.equity_details.children;

    const [_alf, bob] = equityOwnersList.value;

    const bobVariant = bob.children.ssnOrPassport;
    expect(bobVariant.isValid).toBe(true);
  });

  it('sets the polymorphic node isValid to false if the selected child is not valid', () => {
    const {root} = setup({schema: ssnPassportSchema(invalidSsnPassportValues)});
    const {equityOwnersList} = root.children.equity_details.children;

    const [_, bob] = equityOwnersList.value;

    const bobVariant = bob.children.ssnOrPassport;

    expect(bobVariant.isValid).toBe(false);

    expect(bobVariant.data()).toStrictEqual({
      ssn: '',
      ssnOrPassportType: 'variantSsn',
    });
  });
});

describe('polymorphic node set value with object', () => {
  let color: SchemaNode;
  let root: SchemaNode;

  const clog = jest.spyOn(console, 'log').mockImplementation();
  const cwarn = jest.spyOn(console, 'warn').mockImplementation();
  const cerror = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    clog.mockClear();
    cwarn.mockClear();
    cerror.mockClear();
    root = setup({schema: colorSchema}).root;
    color = root.children.color;
  });

  it('console.warn when attempting to set the value of a node that does not exist', () => {
    const {root} = setup({schema: colorSchema});

    root.onChange({keyThatDoesNotExists: true, moreKeys: 0});
    expect(cwarn).toHaveBeenCalledWith(
      'Trying to set values on nonexisting keys. Orphans: keyThatDoesNotExists, moreKeys',
    );
  });

  it('console.error when attempting to set an invalid polymorphic structure', () => {
    color.onChange({red: 0});
    expect(cerror).toHaveBeenCalledWith(
      "Failed to set value of the 'color' polymorphic node,\
 the structure is not known and requires the 'colorType' property",
    );
  });

  it('console.warn does not trigger by default', () => {
    color.onChange({}); // Empty object are ignored for now, cloning values could trigger this
    color.onChange('rgb'); // Uses the string signature
    color.onChange('hex');
    color.onChange({colorType: 'hex'});

    expect(clog).toHaveBeenCalledTimes(0);
    expect(cwarn).toHaveBeenCalledTimes(0);
    expect(cerror).toHaveBeenCalledTimes(0);
  });

  it('updating polymorphic values with object does not reset unselected variants', () => {
    color.onChange({colorType: 'hex', hex: '#000000'});
    color.onChange({colorType: 'rgb', red: 255, green: 255, blue: 255});
    color.onChange('hex');
    expect(root.data()).toStrictEqual({
      color: {colorType: 'hex', hex: '#000000'},
    });
    expect(color.children.rgb.data()).toStrictEqual({
      red: 255,
      green: 255,
      blue: 255,
    });
  });
});
