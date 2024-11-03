import React, { useState, useRef, useMemo, useEffect } from 'react'
import Seat from './Seat'
import { Box, Grid } from '@chakra-ui/react'
import { seatMargin, seatSize } from 'app/config'
import { useFetcher } from '@remix-run/react'
import { Room, Seat as SeatType, Student } from '~/model/model'

const SelectableSeatSet: React.FC<{ user: Student; classId: string; defaultSeats: Room }> = ({
    user,
    classId,
    defaultSeats,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    // 1次元に変換する
    const totalSeats = defaultSeats.seats.length * defaultSeats.seats[0].length
    const columnCount = defaultSeats.seats[0].length
    const [enableSeats, setEnableSeats] = useState(
        //seatsの中身を1次元に
        defaultSeats.seats.flat(1),
    )
    const fetcher = useFetcher()

    // データ更新時
    //  サーバー側のデータを更新する

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Submits a request to modify seat data for a given index.
     *
     * @param index - The index of the seat to be modified.
     *
     * @description
     * This function uses the fetcher to submit a request to the server to modify
     * seat data based on the provided index. It calculates the x and y coordinates
     * from the index, and sends user and class information along with these
     * coordinates to the server for processing.
     */
    /******  1b6f378d-68b7-4156-8b9e-9e79e0b7324b  *******/
    function modifySeats(index: number) {
        // fetcherを使用してユーザーデータを確認
        fetcher.submit(
            {
                user: {
                    id: user.id,
                    displayName: user.displayName,
                },
                classId: classId,
                x: Math.floor(index % columnCount),
                y: Math.floor(index / columnCount),
                function: 'modifyClass',
            },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            setEnableSeats((fetcher.data as Array<Array<boolean | Array<{ id: string; displayName: string }>>>).flat(1))
        }
    }, [fetcher.data])

    return (
        <Box ref={containerRef} className='overflow-auto' maxWidth='100%' maxHeight='100%' mx='auto'>
            <Grid className='w-fit' justifyContent='center' templateColumns={`repeat(${columnCount}, 1fr)`}>
                {[...Array(totalSeats)].map((_, index) => {
                    return (
                        <Box
                            //その場所を誰が選択しているかを返す
                            key={index}
                            margin={seatMargin}
                            onClick={() => {(
                                enableSeats[index] ? modifySeats(index) : null
                                )}
                            }
                        >
                            <Seat
                                text={
                                    typeof enableSeats[index] == 'boolean'
                                        ? ''
                                        : Array.from(enableSeats[index])
                                            .map((seat) => `${seat.displayName ? seat.displayName : seat.id}`)
                                            .join(', ')
                                }
                                isDisabled={!enableSeats[index]}
                            />
                        </Box>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default SelectableSeatSet
