import cn from 'classnames'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { web3 } from '../../core/web3'
import { chains } from '../../core/chain'
import { FormTextItem } from './FormTextItem'
import { normalizeChain, normalizeError, subtractDiscount } from '../../core/utils'
import { connect, selectIsConnected, selectUserAddress } from '../../redux/wallet-connect-slice'
import {
  fetchAddressInfo,
  fetchAllowance,
  fetchData,
  selectDiscount,
  selectPlan,
  selectPlans,
  selectPromo,
  selectToken,
  setPlan,
  setPromo,
  setPromoDiscount
} from '../../redux/contract-slice'

function FormChoosePlan({ onFinish }) {
  const dispatch = useDispatch()

  const discount = useSelector(selectDiscount)
  const isConnected = useSelector(selectIsConnected)
  const userAddress = useSelector(selectUserAddress)
  const promo = useSelector(selectPromo)
  const plans = useSelector(selectPlans)
  const plan = useSelector(selectPlan)
  const token = useSelector(selectToken)

  const [isPending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const noPromo = !promo || !promo.length
  const onApply = v => {
    v.preventDefault()

    if (noPromo || isPending) return

    setError(null)
    setPending(true)

    web3.getPromoCode(promo)
      .then(res => {
        if (parseInt(res.deadline) === 0) {
          setError(`Promo code "${promo}" doesn't exist`)
        } else {
          dispatch(setPromoDiscount(res.discountRate))
        }
        setPending(false)
      })
      .catch(e => {
        setError(normalizeError(e.message))
        setPending(false)
      })
  }

  const chain = chains.activeChain
  const onSelectChain = item => {
    if (item.id === chain.id) {
      return
    }

    chains.setChain(item)
    web3.setWeb3(item)

    dispatch(fetchData(true))
    dispatch(fetchAllowance(userAddress, token.address))
    dispatch(fetchAddressInfo(userAddress, true))
  }
  const onNext = () => isConnected ? onFinish('plan', 2) : dispatch(connect())
  const onChangePromo = v => {
    dispatch(setPromo(v.target.value))
    setError(null)
  }

  const costFinal = (
    <div>
      {discount && <s className={cn('text-grey pe-2 small fw-semibold')}>
        {plan.amount} ${token.symbol}
      </s>}
      <span>{subtractDiscount(discount, plan.amount)} {token.symbol}</span>
    </div>
  )

  return (
    <div className="Pay-content-body">
      <fieldset className="Pay-fieldset Pay-fieldset-padding">
        <div className="row mb-3">
          <div className="col-6 col-form-label text-grey">Selected Plan</div>
          <div className="col-6">
            <div className="Pay-fieldset-right">
              <div className="dropdown">
                <div className="btn dropdown-toggle text-capitalize text-white border-0 pe-0" data-bs-toggle="dropdown">
                  {plan.interval} {plan.intervalName}
                </div>
                <ul className="dropdown-menu dropdown-menu-end">
                  {plans.map(item => (
                    <li key={item.amount} onClick={() => dispatch(setPlan(item))}>
                      <div className="dropdown-item text-capitalize" role="button">
                        {item.interval} {item.intervalName}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 col-form-label text-grey">Chain</div>
          <div className="col-6">
            <div className="Pay-fieldset-right">
              <div className="dropdown">
                <div className="btn dropdown-toggle text-capitalize text-white border-0 pe-0" data-bs-toggle="dropdown">
                  {normalizeChain(chain.name)}
                </div>
                <ul className="dropdown-menu dropdown-menu-end">
                  {chains.list.map(item => (
                    <li key={item.name} className="dropdown-item" onClick={() => onSelectChain(item)}>
                      {normalizeChain(item.name)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
        <FormTextItem title="Cost" value={costFinal} yellow />
      </fieldset>
      <div className="row mt-3">
        <div className="col">
          <form onSubmit={onApply}>
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-transparent Pay-fieldset Pay-fieldset-padding border-end-0 shadow-none"
                placeholder="Promo code"
                value={promo}
                onChange={onChangePromo}
                required
              />
              <div className="input-group-text bg-transparent Pay-fieldset border-start-0">
                <button type="submit" className="Button Button-circle Button-steal border-0" disabled={isPending}>
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className={cn('mt-2', { 'text-grey': !error, 'text-danger': error })}>{error || 'Enter a promo code to get a discount'}</div>
        </div>
      </div>
      <button className="Button Button-yellow Button-circle mt-4 w-100 border-0 justify-content-center" disabled={isPending} onClick={onNext}>
        {isConnected ? 'Next' : 'Connect Wallet'}
      </button>
    </div>
  )
}

export default FormChoosePlan
