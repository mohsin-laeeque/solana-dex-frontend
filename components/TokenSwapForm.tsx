import { Box } from "@chakra-ui/react"
import { FC } from "react"
import { DepositSingleTokenType } from "./Deposit"
import { WithdrawSingleTokenType } from "./Withdraw"
import {AddLiquidtyPool} from "./AddLiquidtyPool"
import { SwapToken } from "./Swap"

export const TokenSwapForm: FC = () => {
    return (
        <Box>
            <DepositSingleTokenType />
            <WithdrawSingleTokenType />
            <SwapToken />
            <AddLiquidtyPool></AddLiquidtyPool>
        </Box>
    )
}
