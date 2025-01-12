# How to resend a failed Bitcoin transaction?

When users send a Bitcoin transactions with a really low fee, a transaction is likely to get rejected by the network. When this happens you may consider the transaction never happened and resend the transaction as a new transaction.

When you encounter a transaction with failed/rejected status in Termite it's recommended to recheck that transaction actually failed using some public block explorer like [https://btc.com](https://btc.com) by searching for the ID of the respective transaction.

If Termite shows a transaction as failed/rejected but some public block explorer shows it as pending or confirmed then most likely the information provided by block explorer is the correct one. Do not attempt to resend the transaction in this case and please report the issue to Termite wallet support for troubleshooting.

Consider the transaction failed and attempt to resend it only if both Termite and public block explorer shows transaction as failed/rejected.
