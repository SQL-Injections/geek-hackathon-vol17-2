import React from 'react'
import { Box } from '@chakra-ui/react'
import { seatSize } from 'app/config'

type SeatPropsType = {
    text: string
    isReserved?: boolean
    isDisabled?: boolean
}

const Seat: React.FC<SeatPropsType> = ({ text, isReserved, isDisabled }) => {
    return (
        <Box
            className='content-center text-center rounded'
            backgroundColor={isReserved ? 'red' : 'green'}
            opacity={isDisabled ? 0.5 : 1}
            width={seatSize}
            height={seatSize}
            fontSize={seatSize / 5}
            overflowY ={'auto'}
        >
            {text}
        </Box>
    )
}

export default Seat
