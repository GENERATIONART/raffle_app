import { Box, Spinner, Text } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
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
    
    return (      
        <Box>
            <Box>
                <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Contract Balance</Text>
                {!contractBalanceLoading ? (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(contractBalance)} DOS</Text>
                ) : (
                    <Spinner />
                )}
            </Box>
            <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "withdraw", [0]
                )}
            >Withdraw Balance</Web3Button>
             <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "withdrawBalance", [0]
                )}
            >Withdraw Native Token</Web3Button>
            
        </Box>
       

        
    )
}