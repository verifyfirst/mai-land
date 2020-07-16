import React from 'react'
import { Row, Col, Input } from 'antd'
import { PoweroffOutlined } from '@ant-design/icons';

import {
    Colour, H1, H2, Subtitle, Label, LabelGrey, Sublabel, Text, P, LabelGroup,
    Gap, Center, Button
} from '../components/elements';

const About = (props) => {

    // const boxStyles = {
    //     display: 'flex',
    //     textAlign: "center",
    //     justifyContent: "center",

    // }

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <H1>Heading1</H1><br />
                    <H2>Heading2</H2><br />
                    <Subtitle>Subtitle</Subtitle><br />
                    <Label>Label</Label><br />
                    <LabelGrey>LabelGrey</LabelGrey><br />
                    <Sublabel>Sublabel</Sublabel><br />
                    <Text>Text</Text>
                    <Text bold={true}>Text-bold</Text>
                    <Text size={32}>Text-size</Text>
                    <br />
                    <P>Paragraph</P><br />
                    <Gap></Gap>
                    <LabelGroup title={'VOLUME'} label={'$24,000.00'} />
                </Col>
                <Col xs={12}>
                    <Button type={'primary'}>Button-primary</Button>
                    <Button type={'secondary'}>Button-block</Button>
                    <Button type="primary" danger>Primary</Button>
                    <Button danger>Default</Button>
                    <Button type="dashed" danger icon={<PoweroffOutlined />}>Dashed</Button>
                    <Button type="text">Text</Button>
                    <Button type="link">Link</Button>
                    <Input placeholder={'enter amount'}></Input>
                </Col>
            </Row>


            <Row style={{ height: 30, margin: 30 }}>
                <Col xs={4} style={{ backgroundColor: Colour().black }}>
                    <Center><Text color={Colour().white}>Black</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().dgrey }}>
                    <Center><Text color={Colour().white}>dgrey</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().grey }}>
                    <Center><Text color={Colour().white}>grey</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().lgrey }}>
                    <Center><Text>lgrey</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().offwhite }}>
                    <Center><Text>offwhite</Text></Center>
                </Col>
            </Row>
            <Row style={{ height: 30, margin: 30 }}>
                <Col xs={4} style={{ backgroundColor: Colour().primary }}>
                    <Center><Text color={Colour().white}>primary</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().secondary }}>
                    <Center><Text color={Colour().white}>secondary</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().accent }}>
                    <Center><Text color={Colour().white}>accent</Text></Center>
                </Col>
                {/* <Col xs={4} style={{ backgroundColor: Colour().lgrey }}>
                    <Center><Text>lgrey</Text></Center>
                </Col>
                <Col xs={4} style={{ backgroundColor: Colour().offwhite }}>
                    <Center><Text>offwhite</Text></Center>
                </Col> */}
            </Row>

        </div>
    )
}

export default About