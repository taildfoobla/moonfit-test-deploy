import React, { useEffect, useState } from "react"
import { Row, Button, Image } from "antd"
import {
    CheckOutlined,
} from "@ant-design/icons"
import MFModal from "../../../../../../components/MFModal"
import sizeGuie from "../../../../../../assets/images/size_guide.jpg"

const RewardProduct = (props) => {

    const { color, setSize, setColor } = props
    const [openSizeGuide, setOpenSizeGuide] = useState(false)
    const [listSize, setListSize] = useState(LIST_SIZE)
    const [listColor, setListColor] = useState(LIST_COLOR)

    useEffect(() => {
        setColor(LIST_COLOR[0])
    }, [])

    const onChangeSize = (e) => {
        const { value } = e.target
        const sizes = LIST_SIZE.map(s => {
            return {
                ...s,
                checked: s.value === value
            }
        })
        setListSize(sizes)
        setSize(sizes.find(s => s.checked) || "")
    }

    const onChangeColor = (e) => {
        const { value } = e.target
        const colors = LIST_COLOR.map(c => {
            return {
                ...c,
                checked: c.value === value
            }
        })
        setListColor(colors)
        setColor(colors.find(c => c.checked) || "")
    }

    return (
        <>
            <Row>
                <h4>PICK YOUR SIZE & COLOR</h4>
            </Row>
            <div className="reward-product-box">
                <MFModal
                    visible={openSizeGuide}
                    footer={false}
                    className="no-padding"
                    onCancel={() => setOpenSizeGuide(false)}
                >
                    <Image src={sizeGuie} preview={false} alt="size_guide" />
                </MFModal>
                <Row justify="space-between">
                    <span className="white-bold">SIZE</span>
                    <a onClick={() => setOpenSizeGuide(true)}>Size guide</a>
                </Row>
                <div className="size-list">
                    {
                        listSize.map((size, index) => (
                            <label key={`size-${index}`}>
                                <input type="radio" name="size" value={size.value} onChange={onChangeSize} />
                                <div className="button"><span className={`${size.checked ? 'active' : ''}`}>{size.label}</span></div>
                            </label>
                        ))
                    }
                </div>
                <p className="white-bold">COLORS: <span className="color-grey">{color.label}</span></p>
                <div className="color-list">
                    {
                        listColor.map((color, index) => (
                            <label key={`color-${index}`}>
                                <input type="radio" name="color" value={color.value} onChange={onChangeColor} />
                                <div className={`button ${color.label.toLowerCase()}`}>
                                    <div className={`${color.checked ? 'active' : ''}`}>
                                        <span style={{ background: color.value }}>
                                            {
                                                color.checked && <CheckOutlined />
                                            }
                                        </span>
                                    </div>
                                </div>
                            </label>
                        ))
                    }
                </div>
            </div>
        </>


    )
}

const LIST_SIZE = [
    { label: 'XS', value: 'xs' },
    { label: 'S', value: 's' },
    { label: 'L', value: 'l' },
    { label: 'XL', value: 'xl' },
    { label: '2XL', value: '2xl' },
];

const LIST_COLOR = [
    {
        label: 'WHITE',
        value: '#ffffff',
        checked: true,
    },
    {
        label: 'BLACK',
        value: '#000000',
    },
    {
        label: 'BLUE',
        value: '#48c8f0',
    },
    {
        label: 'PURPLE',
        value: '#a16bd8',
    },
    {
        label: 'GREEN',
        value: '#a5d990',
    },
    {
        label: 'PINK',
        value: '#e4007b',
    }
]

export default RewardProduct