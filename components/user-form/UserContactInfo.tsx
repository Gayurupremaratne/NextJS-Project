import React from 'react';
import { FormikProps } from 'formik';
import { UserPayload } from '@/types/user/user.type';
import { Input, InputContainer, Text } from '@/components/atomic';
import { FormActions } from '@/constants/form-actions';
import ReactFlagsSelect from 'react-flags-select';
import 'react-phone-number-input/style.css';
import PhoneInput, {
  Country,
  getCountryCallingCode,
} from 'react-phone-number-input';
import customInputComponentWithSetCountryCode from '../atomic/CustomInputCountryInputCodeSelect/CustomInputCountryCodeSelect';
import CustomCountrySelect from '../atomic/CustomCountrySelectCode/CustomCountrySelectCode';

interface Props {
  action?: FormActions;
  formik: FormikProps<UserPayload>;
  setSelectedCountryForCode: (value: string) => void;
  selectedCountryForCode?: string;
  setCountryCode: (value: string) => void;
}

export const UserContactInfo = ({
  action,
  formik,
  setSelectedCountryForCode,
  selectedCountryForCode,
  setCountryCode,
}: Props) => {
  return (
    <div
      className={`flex flex-col mt-5 ${
        typeof action === 'undefined' ? 'min-w-full' : 'w-full'
      }`}
    >
      <div
        className={`grid md:grid-cols-3 md:gap-x-5 ${
          typeof action === 'undefined'
            ? 'md:gap-y-0 gap-y-2'
            : 'md:mr-32 lg:w-4/5'
        } w-full`}
      >
        <div className="flex flex-col gap-2">
          <Text
            className="after:content-['*'] after:ml-0.5 after:text-red font-albertSans"
            intent="dark"
            size={'sm'}
            weight={'normal'}
          >
            Nationality
          </Text>
          <ReactFlagsSelect
            className="rounded-[5px] border-1 border-red text-shades-battleship-grey-shade-6 font-sm h-9 font-albertSans font-normal focus:outline-none w-full"
            fullWidth={true}
            onSelect={flagSelectorCountryCode => {
              formik.handleChange({
                target: {
                  name: 'nationalityCode',
                  value: flagSelectorCountryCode,
                },
              });
            }}
            searchable={true}
            selected={formik.values.nationalityCode}
          />
          <Text intent="red" size="xs" type="p">
            {formik.errors.nationalityCode && formik.touched.nationalityCode
              ? [formik.errors.nationalityCode]
              : undefined}
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Text
            className="font-albertSans"
            intent={'dark'}
            size={'sm'}
            weight={'normal'}
          >
            Country code
          </Text>
          <InputContainer>
            <ReactFlagsSelect
              className="rounded-[5px] border-1 border-red text-shades-battleship-grey-shade-6 font-sm font-albertSans font-normal focus:outline-none h-[42px] pt-0.5"
              fullWidth={false}
              id="countryCodeSelect"
              onSelect={country => {
                setSelectedCountryForCode(country);
                const value = getCountryCallingCode(country as Country);
                formik.handleChange({
                  target: {
                    name: 'countryCode',
                    value: `+${value}`,
                  },
                });
              }}
              searchable={true}
              selected={selectedCountryForCode ?? formik.values.nationalityCode}
              showSelectedLabel={false}
            />
            <PhoneInput
              countrySelectComponent={CustomCountrySelect}
              defaultCountry={
                (selectedCountryForCode ??
                  formik.values.nationalityCode) as Country
              }
              disabled={true}
              inputComponent={customInputComponentWithSetCountryCode(
                setCountryCode,
              )}
              international
              name="countryCode"
              onChange={formik.handleChange}
              readOnly={true}
            />
          </InputContainer>
          <Text intent="red" size="xs" type="p">
            {formik.errors.countryCode &&
              formik.touched.countryCode &&
              formik.errors.countryCode}
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Text
            className="font-albertSans"
            intent={'dark'}
            size={'sm'}
            weight={'normal'}
          >
            Contact number
          </Text>
          <div className="h-11 w-full flex flex-row items-stretch rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 hover:border-tints-forest-green-tint-2 focus:border-tints-forest-green-tint-1 ">
            <Input
              className={
                'h-full rounded-[5px] border-none focus:outline-none pl-3 w-full border-tints-battleship-grey-tint-5 '
              }
              name="contactNumber"
              onBlur={formik.handleBlur}
              onChange={value => {
                formik.handleChange({
                  target: {
                    name: 'contactNumber',
                    value:
                      typeof value === 'undefined' ? '' : value.target.value,
                  },
                });
              }}
              placeholder="798926369"
              type="number"
              value={formik.values.contactNumber as string}
            />
          </div>
          <Text intent="red" size="xs" type="p">
            {formik.errors.contactNumber &&
              formik.touched.contactNumber &&
              formik.errors.contactNumber}
          </Text>
        </div>
      </div>
    </div>
  );
};
