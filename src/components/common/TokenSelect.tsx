import { Fragment, useState, FC, useMemo, useEffect } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useTokenList } from '@/hooks/useTokenList'
import { utils } from 'ethers'
import { shortenAddress } from '@/utils'

type Props = {
  label: string
  onChange: (token: Token) => void
}

const TokenSelect: FC<Props> = ({ label, onChange }) => {
  const [selected, setSelected] = useState<Token>()
  const [query, setQuery] = useState('')

  const { tokens, isLoading } = useTokenList(query)

  const labelFor = useMemo(() => 'token-select-' + label, [label])

  useEffect(() => {
    if (selected) {
      onChange(selected)
    }
  }, [selected, onChange])

  return (
    <div className="w-full grid grid-cols-4 items-center overflow-visible gap-4">
      <label className="text-white uppercase text-right" htmlFor={labelFor}>
        {label}
      </label>
      <div className="col-span-3 w-full">
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(token: Token) =>
                  `${token.name} (${token.symbol})`
                }
                onChange={(event) => {
                  if (!utils.isAddress(event.target.value)) {
                    setQuery(event.target.value)
                  }
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              // afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                {isLoading ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Loading ...
                  </div>
                ) : tokens.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  tokens.map((token) => (
                    <Combobox.Option
                      key={token.id}
                      id={token.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={token}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {token.name} ({shortenAddress(token.id)})
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  )
}

export default TokenSelect
