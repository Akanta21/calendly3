import { useState, useEffect } from 'react';
import { Box, Button, Slider } from '@material-ui/core';
import contract from '../factory/contract'
import { ethers } from 'ethers';

const marks = [
    {
      value: 0.00,
      label: 'Free',
    },
    {
      value: 0.02,
      label: '0.02 ETH/min',
    },
    {
      value: 0.04,
      label: '0.04 ETH/min',
    },
    {
        value: 0.06,
        label: '0.06 ETH/min',
    },
    {
        value: 0.08,
        label: '0.08 ETH/min',
    },
    {
      value: 0.1,
      label: 'Expensive',
    },
  ];

const Admin = () => {
    const [rate, setRate] = useState(0);

    const handleSliderChange = (event, newValue) => {
        setRate(newValue);
    };
    
    const saveRate = async () => {
        const newRate = ethers.utils.parseEther(rate.toString())

        const tx = await contract.setRate(newRate);
    }

    const getData = async() => {
        const rate = await contract.getRate();
        setRate(ethers.utils.formatEther(rate.toString()));
    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <div id="admin">
            <Box>
                <h3>Set Your Minutely Rate</h3>
                {rate && <Slider defaultValue={rate} 
                    step={0.001} 
                    min={0} 
                    max={.1} 
                    valueLabelDisplay="auto"
                    marks={marks}
                    onChangeCommitted={handleSliderChange} />}
                <br /><br />
                <Button onClick={saveRate} variant="contained">save configuration</Button>
            </Box>
        </div>
    )
}

export default Admin