import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import { JSONPrettyStringify } from './utils';

export const expectTransactionShouldEq = (
    expected: TransactionAssertion,
    actual: RPCTransactionChange,
) => {
    const errMessage = (msg: string): string =>
        `${msg}: ${JSONPrettyStringify(actual)}`;

    expect(actual.kind).to.eq(
        expected.kind,
        errMessage('transaction kind mismatch'),
    );
    if (expected.outputs) {
        expect(actual.outputs.length).to.eq(
            expected.outputs.length,
            'outputs length mismatch',
        );
        for (let i = 0, l = expected.outputs.length; i < l; i += 1) {
            const expectedOutput = expected.outputs[i];
            const actualOutput = actual.outputs[i];

            expect(actualOutput.address).to.eq(
                expectedOutput.address,
                errMessage(`output ${i} address mismatch`),
            );
            if (expectedOutput.validFrom) {
                expect(actualOutput.valid_from.toNumber()).to.eq(
                    expectedOutput.validFrom,
                    errMessage(`output ${i} valid from mismatch`),
                );
            }
            expect(actualOutput.value).to.eq(
                expectedOutput.value,
                errMessage(`output ${i} value mismatch`),
            );
        }
    }
    if (expected.txId) {
        expect(actual.transaction_id).to.eq(
            expected.txId,
            errMessage('transaction id mismatch'),
        );
    }
    if (expected.value) {
        expect(actual.value).to.eq(
            expected.value,
            errMessage('transaction value mismatch'),
        );
    }
};

export interface TransactionAssertion {
    kind: TransactionChangeKind;
    outputs?: TransactionChangeOutputAssertion[];
    txId?: string;
    value: string;
}

export interface TransactionChangeOutputAssertion {
    address: string;
    validFrom?: number;
    value: string;
}

/* eslint-disable camelcase */
export interface RPCTransactionChange {
    block_height: BigNumber;
    block_time: string;
    fee: string;
    inputs: any[];
    kind: TransactionChangeKind;
    outputs: RPCTransactionChangeOutput[];
    transaction_id: string;
    transaction_type: TransactionType;
    value: string;
}
/* eslint-enable camelcase */

export enum TransactionChangeKind {
    Incoming = 'Incoming',
    Outgoing = 'Outgoing',
}

/* eslint-disable camelcase */
export interface RPCTransactionChangeOutput {
    address: string;
    valid_from: BigNumber;
    value: string;
}
/* eslint-enable camelcase */

export enum TransactionType {
    Withdraw = 'Withdraw',
    Transfer = 'Transfer',
}
