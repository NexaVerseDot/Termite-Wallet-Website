import { DateTime } from 'luxon'
import { createSlice } from '@reduxjs/toolkit'
import { convertFromRawAmount } from '../core/utils'
import { web3 } from '../core/web3'
import { chains } from '../core/chain'
import { fetchLogs, postSubscribed } from '../core/api'

const plans = [
  { interval: 1, intervalName: 'month', amount: 89, duration: 30 },
  { interval: 3, intervalName: 'month', amount: 210, duration: 90 },
  { interval: 6, intervalName: 'month', amount: 320, duration: 180 }
]

const initialState = {
  token: {},
  addressInfo: {},
  addressFetching: null,
  discount: null,
  fetching: null,
  promo: '',
  plans,
  plan: plans[0],
  allowance: null,
  allowanceStatus: null
}

export const { actions, reducer } = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setFetching: (state, { payload }) => {
      state.fetching = payload
    },
    setPlan: (state, { payload }) => {
      state.plan = payload
    },
    setPromo: (state, { payload }) => {
      state.promo = payload
      state.discount = null
    },
    setPromoDiscount: (state, { payload }) => {
      const discount = parseInt(payload)
      if (discount > 0) {
        state.discount = discount
      }
    },
    setAllowanceState: (state, { payload }) => {
      state.allowanceStatus = payload
    },
    setAllowance: (state, { payload }) => {
      state.allowance = payload
      state.allowanceStatus = 'fetched'
    },
    setTokenInfo: (state, { payload }) => {
      state.token = payload.token
    },
    setAddressInfo: (state, { payload }) => {
      state.addressInfo = payload
    },
    setAddressFetching: (state, { payload }) => {
      state.addressFetching = payload
    },
  }
})

export const { setPlan, setPromo, setPromoDiscount, setAddressInfo } = actions

export const selectPromo = state => state.contract.promo
export const selectPlans = state => state.contract.plans
export const selectPlan = state => state.contract.plan
export const selectDiscount = state => state.contract.discount
export const selectToken = state => state.contract.token
export const selectAddressInfo = state => state.contract.addressInfo
export const selectIsFetched = state => state.contract.fetching === 'fetched'
export const selectFetchingFailed = state => state.contract.fetching === 'failed'
export const selectAddressFetching = state => state.contract.addressFetching === 'fetching'
export const selectAllowance = state => state.contract.allowance

export const fetchData = isForce => async (dispatch, getState) => {
  const {
    contract: { fetching, token }
  } = getState()

  if (!isForce && (fetching === 'fetching' || (token.address && token.symbol))) {
    return
  }

  dispatch(actions.setFetching('fetching'))

  try {
    const address = await web3.getPaymentToken()
    console.log('Fetched payment token', address)

    const token = {
      address,
      symbol: await web3.getSymbol(address),
      decimals: parseInt(await web3.getDecimals(address))
    }

    dispatch(actions.setTokenInfo({ token }))
    dispatch(actions.setFetching('fetched'))
  } catch (e) {
    console.error(e)
    dispatch(actions.setFetching('failed'))
  }
}

export const fetchAddressInfo = (address, isForce) => async (dispatch, getState) => {
  if (!address) return

  const {
    contract: { addressInfo, addressFetching }
  } = getState()

  if (!isForce && (addressFetching || addressInfo.address === address)) {
    return
  }

  dispatch(actions.setAddressFetching('fetching'))
  dispatch(actions.setAddressInfo({}))

  try {
    const [isModerator, isAdmin, expiration, balance] = Object.values(await web3.getAddressInfo(address))
    const info = { isModerator, isAdmin, balance: balance / 100, userAddress: address }
    const seconds = parseInt(expiration)
    const secondsNow = new Date().getTime() / 1000
    const isModer = isModerator || isAdmin
    const allLogs = await fetchLogs(chains.activeChain.id, isModer ? null : address)

    const logs = {
      promoCodes: await web3.getPromoCods(isModer ? null : address),
      updateSubscriptions: await web3.getUpdateSubscription(),
      subscriptions: await web3.getSubscriptions(isModer ? null : address)
    }

    const { promoCodes, updateSubscriptions, subscriptions } = await web3.decodeLogHistory(logs, allLogs)

    if (promoCodes) {
      info.promoCodes = promoCodes
    }

    if (updateSubscriptions) {
      info.updateSubscriptions = updateSubscriptions
    }

    if (subscriptions) {
      info.subscriptions = subscriptions
    }

    if (seconds && (seconds - secondsNow) > 0) {
      info.expiration = DateTime.fromSeconds(seconds).toFormat('DD')
    }

    dispatch(actions.setAddressInfo(info))
    dispatch(actions.setAddressFetching('fetched'))
  } catch (e) {
    console.error(e)
    dispatch(actions.setAddressFetching('failed'))
  }
}

export const fetchAllowance = (owner, token) => async (dispatch, getState) => {
  const { contract } = getState()

  if (!owner || !token) {
    console.log('Owner and token addresses are required')
    return
  }

  if (contract.allowanceStatus === 'pending') {
    return
  }

  dispatch(actions.setAllowanceState('pending'))

  try {
    const allowance = await web3.getAllowance(owner, token)
    const bigNumber = convertFromRawAmount(allowance, contract.token.decimals)
    dispatch(actions.setAllowance(bigNumber.toString()))
  } catch (e) {
    dispatch(actions.setAllowanceState('failed'))
  }
}

export const setSubscribed = (address, chain) => async () => {
  await postSubscribed(address, chain.toLowerCase())
}

export default reducer
