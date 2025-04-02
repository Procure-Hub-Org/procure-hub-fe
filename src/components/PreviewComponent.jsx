import React, { useState } from 'react';
import PrimaryButton from './Button/PrimaryButton';
import SecondaryButton from './Button/SecondaryButton';
import BasicButton from './Button/BasicButton';
import OutlinedButton from './Button/OutlinedButton';
import CustomTextField from './Input/TextField';
import CustomSelect from './Input/DropdownSelect';
import CustomSearchInput from './Input/SearchInput';
import CustomCheckbox from './Input/Checkbox'; // Adjust the import path as necessary
import CustomRadioGroup from './Input/RadioSelect'; // Adjust the import path as necessary


//added customized components for preview testing
const PreviewComponent = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
 
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleCheckboxChange = (event) => {
    setCheckboxChecked(event.target.checked);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div>
      <h2>Button Previews</h2>
      <PrimaryButton>Click Me</PrimaryButton>
      <SecondaryButton>Click</SecondaryButton>
      <BasicButton>Click</BasicButton>
      <OutlinedButton>Click</OutlinedButton>

      {/* Custom Input Text Field */}
      <h3>Custom TextField</h3>
      <CustomTextField label="Enter text" placeholder="Type something here..." />

      {/* Custom Select Field */}
      <h3>Custom Select</h3>
      <CustomSelect
        value={selectedValue}
        onChange={handleSelectChange}
        options={options}
        helperText="Please select an option"
      />


      {/* Custom Search Input */}
      <h3>Custom Search Input</h3>
      <CustomSearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />


      {/* Custom Checkbox */}
      <h3>Custom Checkbox</h3>
      <CustomCheckbox
        label="Custom Checkbox"
        checked={checkboxChecked}
        onChange={handleCheckboxChange}
      />

      {/* Custom Radio Group */}
      <h3>Custom Radio Group</h3>
      <CustomRadioGroup
        label="Select an option"
        value={radioValue}
        onChange={handleRadioChange}
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
        ]}
      />
    </div>
  );
};

export default PreviewComponent;