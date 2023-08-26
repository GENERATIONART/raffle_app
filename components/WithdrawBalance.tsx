import { Box, Spinner, Text, Stack } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS, TOKEN_ID } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

export default function WithdrawBalance() {
    const {
        contract
    } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: contractBalance,
        isLoading: contractBalanceLoading
    } = useContractRead(contract, "getBalance");

    const {
        data: ERC20contractBalance,
        isLoading: contractERC20BalanceLoading
    } = useContractRead(contract, "getBalanceERC20", [0]);
    
    
    return (      
        <Stack spacing={4}>
       
            <Box>
                <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Contract Balance</Text>
                {!contractERC20BalanceLoading && ERC20contractBalance ?  (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(ERC20contractBalance).toString()} {TOKEN_ID}</Text>
                ) : (
                    <Text fontSize={"xl"}> 0 {TOKEN_ID}</Text>
                )}
            </Box>
            {/* <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(    
                    "withdraw", [0]
                )}
                >Withdraw Balance</Web3Button>*/}
             <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "withdrawBalance", [0]
                )}
            >Withdraw {TOKEN_ID}</Web3Button>
            
       
       </Stack>

        
    )
}