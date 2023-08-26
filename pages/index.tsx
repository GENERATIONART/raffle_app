import type { NextPage } from "next";
import { Box, Button, Container, Flex, Input, SimpleGrid, Stack, Text, useEditableStyles } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead  } from "@thirdweb-dev/react";
import { HERO_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS, CUSTOM_TOKEN_ADDRESS, TOKEN_ID } from "../const/addresses";
import LotteryStatus from "../components/Status";
import { ethers } from "ethers";
import PrizeNFT from "../components/PrizeNFT";
import { useState, useEffect } from "react";
import CurrentEntries from "../components/CurrentEntries";
import Winner from "../components/Winner";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract: contract1
  } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const {
    contract: contract2
  } = useContract(CUSTOM_TOKEN_ADDRESS);

  const {
    data: lotteryStatus
  } = useContractRead(contract1, "lotteryStatus");

  const {
    data: ticketCost,
    isLoading: ticketCostLoading
  } = useContractRead(contract1, "ticketCost");
  const ticketCostInEther = ticketCost ? ethers.utils.formatEther(ticketCost) : "0";
  
  const {
    data: totalEntries,
    isLoading: totalEntriesLoading
  } = useContractRead(contract1, "totalEntries");

  const {
    data: ticketCost2,
    isLoading: ticketCost2Loading
  } = useContractRead(contract1, "getTokenCostInfo", [0] );

  const ticketCostInERC20 = ticketCost2 ? ethers.utils.formatEther(ticketCost2).toString() : "0";
 
  const [ticketAmount, setTicketAmount] = useState(0);
  const [allowance, setAllowance] = useState(false);

  const ticketCostSubmit = parseFloat(ticketCostInEther) * ticketAmount;

  function increaseTicketAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseTicketAmount() {
    if (ticketAmount > 0) {
      setTicketAmount(ticketAmount - 1);
    }
  }
  useEffect(() => {
    if (!address) return;
    async function loadApprovalAmount() {
      const approvedAmount = await contract2?.call("allowance", [address , LOTTERY_CONTRACT_ADDRESS]);
      if (approvedAmount>= ticketAmount * ticketCost2){
        setAllowance(true);
      }else{
        setAllowance(false);
      }
    }

    loadApprovalAmount();

  }, [address,contract2,ticketAmount, ticketCost2]);

  console.log(allowance.toString())

  return (
    <Container maxW={"1440px"}>
      
      <SimpleGrid columns={[1,1,2]} spacing={4} minH={"60vh"} >
        <Flex justifyContent={"center"} alignItems={"center"} flexDirection={"row"}>
          {lotteryStatus ? (
            <PrizeNFT />
          ) : (
            <MediaRenderer
              src={HERO_IMAGE_URL}
              width="100%"
              height="100%"
            />
          )}
        </Flex>

        <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
          <Stack spacing={10}>
            <Box>
              <Text fontSize={"xl"}>ART RAFFLES</Text>
              <Text fontSize={"4xl"} fontWeight={"bold"}>Buy a ticket to win the NFT Prize!</Text>
            </Box>
            
            <Text fontSize={"xl"}>Buy entries for a chance to win the NFT! Winner will be selected and transferred the NFT. The more entries the higher chance you have of winning the prize.</Text>
            
            <LotteryStatus status={lotteryStatus}/>
            {!ticketCostLoading && (
              <Text fontSize={"2xl"} fontWeight={"bold"}>Cost Per Ticket: {ticketCostInERC20} {TOKEN_ID}</Text>
            )}
             

            {!allowance ? (
             <Web3Button
                  contractAddress={CUSTOM_TOKEN_ADDRESS}
                  action={(contract) => {
                    contract.call("approve", [LOTTERY_CONTRACT_ADDRESS, 10000000])
                  }}
                >
                  INCREASE {TOKEN_ID} TOKEN ALLOWANCE
                </Web3Button>
                ) :  (
                  <Text> </Text>
                )}

            {address ? (
              <Flex flexDirection={"row"}>
                <Flex flexDirection={"row"} w={"60%"} mr={"40px"}>
                  <Button
                    onClick={decreaseTicketAmount}
                  >-</Button>
                  <Input
                    value={ticketAmount}
                    type={"number"}
                    onChange={(e) => setTicketAmount(parseInt(e.target.value))}
                    textAlign={"center"}
                    mx={.5}
                  />
                  <Button
                    onClick={increaseTicketAmount}
                  >+</Button>
                </Flex>
                
                <Web3Button
                  contractAddress={LOTTERY_CONTRACT_ADDRESS}
                  action={
                    (contract) => 
                    contract.call(
                    "transfer",
                    [
                      ticketAmount
                      , 0
                    ],
                  )}
                  isDisabled={!lotteryStatus || !allowance || !ticketAmount} 
                >{`Buy Ticket(s)`}</Web3Button>
              </Flex>
            ) : (
                     <Text>Connect Wallet</Text>
            )}
            {!totalEntriesLoading && (
              <Text>Total Entries: {totalEntries.toString()}</Text>
            )} 
          </Stack>
        </Flex>
      </SimpleGrid>
      <Stack mt={"30px"} textAlign={"center"}>
      <Text fontSize={"xl"}>Winner of Last Raffle:</Text>
      <Winner/>
        <Text fontSize={"xl"}>New Raffle Participants:</Text>
        <CurrentEntries/>
      </Stack>
    </Container>
  );
};

export default Home;
