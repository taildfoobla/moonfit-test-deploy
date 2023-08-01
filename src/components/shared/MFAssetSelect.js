import React from 'react';
import Select from 'react-select';



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

    // handle custom filter
    const filterOption = (option, inputValue) => {
        return option.data.text.toLowerCase().includes(inputValue.toLowerCase());
    }
    return (
        <>
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