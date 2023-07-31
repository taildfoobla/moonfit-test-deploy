import { reduce } from 'bluebird';
import React, {useState} from 'react';
import Select, { NonceProvider } from 'react-select';

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const promiseOptions = (inputValue) => {
    setTimeout(() => {
        filterColors(inputValue);
    }, 1000);
}


const filterColors = (inputValue) =>
    colourOptions.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );

const customStyles = {
    option: (base, state) => ({
        ...base,      
        color: "#FFF",
        backgroundColor: state.isSelected || state.isFocused ? "rgba(189,197,209,.3)" : "rgba(189,197,209,0)",
        padding: ".5rem 3rem .5rem .5rem",
        cursor: "pointer",
    }),       
    control: (baseStyles, state) => ({
        ...baseStyles,
        height: 50,
        minHeight: 50,
        border: 0,
        backgroundColor: '#1C0532',
        color: '#FFF',
        lineHeight: '50px',
        padding: 0,
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: 50,
        padding: '0 16px',
        border: 0,
        boxShadow: 'none',
    }),
    input: (provided, state) => ({
        ...provided,
        margin: 0,
        color: '#FFF',
        padding: 0,
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: 50,
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#1C0532',
        border: 'none',
        zIndex: 9999
    }),
    menuPortal: provided => ({ ...provided, zIndex: 9999 }),
    singleValue: provided => ({
        ...provided,
        color: '#FFF'
      }),
    placeholder: provided => ({
        ...provided,
        color: '#FFF'
    }),
}

const MFAssetSelect = (props) => {
    const {listOption, assetSelected, handleChangeAsset} = props
    const [selectedOption, setSelectedOption] = useState(null);

    // handle onChange event of the dropdown
    const handleChange = e => {
        setSelectedOption(e);
    }
    
    // handle custom filter
    const filterOption = (option, inputValue) => {
        return option.data.text.toLowerCase().includes(inputValue.toLowerCase());
    }
console.log('selected: ', selectedOption)
    return (
        <>
            {/* <Select
                cacheOptions
                defaultOptions
                options={colourOptions}
                styles={customStyles}
            /> */}
            <Select
                placeholder="Select Option"

                value={assetSelected}
                options={listOption}
                onChange={handleChangeAsset}
                getOptionLabel={e => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={e.image} alt={e.text} style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px'}}/>
                    <span style={{ marginLeft: 5 }}>{e.text}</span>
                </div>
                )}
                filterOption={filterOption}
                styles={customStyles}
            />
        </>
        
    );
};

export default MFAssetSelect;