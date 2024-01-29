import React, { useEffect, useState } from 'react';
import Select from 'react-select';



const customStyles = {
    option: (base, state) => ({
        ...base,      
        color: "#FFF",
        // backgroundColor: state.isSelected || state.isFocused ? "rgba(189,197,209,.3)" : "rgba(189,197,209,0)",
        backgroundColor:"rgba(189,197,209,0)",
        "&:hover": {
            backgroundColor: "rgba(189,197,209,0.3)"
        },
        padding: ".5rem 31px .5rem .5rem",
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
        cursor: 'pointer'
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: 50,
        padding: '0 16px',
        border: 0,
        boxShadow: 'none'
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
        position: 'absolute',
        top: '0px',
        right: '0px',
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#1C0532',
        border: 'none',
        borderRadius: '5px',
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
    const {listOption, assetSelected, handleChangeAsset, isFocus, handleOnFocus, handleOnBlur} = props
    const [focus,setFocus]=useState(false)


    const handleOnFocusInput = () => {
        setFocus(true)
    }

    const handleOnBlurInput = () => {
        setFocus(false)
    }

    // handle custom filter
    
    const filterOption = (option, inputValue) => {
        return option.data.text.toLowerCase().includes(inputValue.toLowerCase());
    }

    return (
        <>
            <Select
                // defaultValue={assetSelected}
                placeholder=""
                blurInputOnSelect={true}
                value={assetSelected}
                options={listOption}
                onChange={handleChangeAsset}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                getOptionLabel={e => (
                <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={e.image} alt={e.text} style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px'}}/>
                        <span style={{ marginLeft: 5 }}>{e.text}</span>
                    </div>
                    <span>{e.balance}</span>
                </div>
                )}
                components={{
                    SingleValue: (props) => {
                      const {children, selectProps} = props
                      const {props: propsChild} = children
                      const {children: childrendChild} = propsChild
                    
                      if(selectProps.menuIsOpen){
                        return <></>
                      }

                      return <div className='singleValue' style={{gridArea: '1/1/2/3', maxWidth: '100%', overflow: 'hidden'}}>
                        <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'space-between', position: 'relative' }}>
                            {childrendChild[0]}
                        </div>
                      </div>;
                    },
                    MenuList: (props) => {
                        console.log('propsss: ', props)
                        return <div className='menuList'>
                            <div className='menuListBox'>
                                <span style={{display: 'block', fontSize: '17px', color: '#FFF', textTransform: 'uppercase', padding: '12px 20px', borderBottom: '1px solid rgba(144, 130, 157, 0.2)'}}>Select a token</span>
                                {props.children}
                            </div>
                        </div>
                    }
                  }}
                filterOption={filterOption}
                styles={customStyles}
            />
        </>
        
    );
};

export default MFAssetSelect;