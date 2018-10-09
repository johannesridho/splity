# Splity
Splity is a split bills bot that will help you to calculate shared expense. Using Splity you can create a channel as a group for sharing shared expense calculation with your friends. After the debtor (people who owe the money) pay their debt, it will be confirmed by the creditor then if all of the debts are paid off, creditor can marked the bills as settled. You can add Splity line handler @splity to give a try!

# Features 
1. Create a channel to start bill split 
Channel is container to start the transaction. After you creating a channel, Splity will generate a key as a password for your friends who want to join the channel.

2. Invite your friends to join the channel 
After successfully creating the channel and get the key, you can share it to your friends. Transaction only can be started if there are min 2 users in a channel.

3. Confirm payment from your friends
As a creditor (who lend a debt), you can confirm payment from your friends.

4. See your payment status
As a creditor and debitor (who owe the money) can check their payment status : waiting for confirmation (you still have a debt) or confirmed (paid off)

6. Settle the debt
As a creditor, you can settle the debt after all of your friends pay off their debt

# Technologies / Tools
1. Dialogflow
2. Typescript
3. Node

# Getting started
Run these commands:
1. yarn
2. yarn build
3. yarn start
