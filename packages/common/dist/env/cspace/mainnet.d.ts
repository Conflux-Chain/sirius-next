import { NETWORK_TYPES } from '../types';
export * from './base';
declare const ENV_LOCALES_EN: {
    nametag: {
        label: string;
        tip: string;
    };
    ens: {
        label: string;
        tip: string;
    };
    profile: {
        title: string;
        subtitle: string;
        tip: {
            label: string;
            note: string;
            exceed: string;
        };
        tx: {
            title: string;
            hash: string;
            note: string;
            search: string;
            error: {
                invalidHash: string;
                invalidNote: string;
                invalidNoteRange: string;
                hash: string;
                note: string;
                duplicated: string;
            };
        };
        address: {
            title: string;
            address: string;
            label: string;
            search: string;
            error: {
                invalidAddress: string;
                invalidNetwork: string;
                invalidLabel: string;
                invalidLabelRange: string;
                address: string;
                label: string;
                duplicated: string;
                duplicatedNameTag: string;
            };
            publicNameTag: string;
            myNameTag: string;
        };
        file: {
            error: {
                invalid: string;
                fileChanged: string;
                chainIdError: string;
            };
            export: {
                button: string;
                tip: string;
                complete: string;
                failed: string;
            };
            import: {
                button: string;
                tip: string;
                complete: string;
                failed: string;
                address: string;
                tx: string;
            };
        };
    };
    metadata: {
        title: string;
        description: string;
    };
    NFTAsset: {
        totalOf721: string;
        totalOf1155: string;
        listLimit: string;
    };
    nftDetail: {
        title: string;
        details: string;
        metadata: string;
        description: string;
        id: string;
        name: string;
        type: string;
        address: string;
        contractInfo: string;
        contractInfoTip: string;
        owner: string;
        url: string;
        creator: string;
        mintedTime: string;
        transfer: string;
        from: string;
        to: string;
        amount: string;
        amountTip: string;
        error: {
            fromAddress: string;
            toAddress: string;
            amount: string;
            id: string;
            invalidAddress: string;
            invalidNetwork: string;
            invalidAmount: string;
        };
        refreshTip: string;
        trait: string;
        datetime: string;
    };
    fccfx: {
        title: string;
        titleAccountInfo: string;
        titleStakeAndSign: string;
        titleWithdrawCFX: string;
        titleMyNFT: string;
        rulesLink: string;
        titleGenerate: string;
        titleAPY: string;
        titleStakedFC: string;
        titleStakedHistory: string;
        titleFCStaked: string;
        titleFCUnsigned: string;
        titleFCStakedHistory: string;
        titleCFXWithdrawed: string;
        titleAvailableProfit: string;
        titleRemainingInterests: string;
        titleStakeFCToEarnCFX: string;
        titleSignToEarnAPY: string;
        titleWithdrawCapital: string;
        titleSignToSyncInterest: string;
        buttonWithdrawInterest: string;
        buttonWithdraw: string;
        buttonAnnounce: string;
        buttonSign: string;
        buttonStake: string;
        availableBalance: string;
        availableToSign: string;
        max: string;
        notice: {
            title: string;
            items: {
                first: string;
                second: string;
                third: string;
                fourth: string;
                fifth: string;
            };
            confirm: string;
        };
        tip: {
            myNFT: string;
            unsignedFC: string;
            legacyProfit: string;
            beforeWithdraw: string;
            withdrawTitle: string;
            exchangeTitle: string;
            signed: string;
            unsigned: string;
            APY: string;
            beforeWithdrawInModal: string;
            beforeExchangeInModal: string;
            required: string;
        };
        buttonCancel: string;
        buttonOk: string;
    };
    contract: {
        status: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
        };
        thisContract: string;
        address: string;
        nameTag: string;
        registered: string;
        site: string;
        tokenSite: string;
        gateway: string;
        gatewayListTip: string;
        contractIcon: string;
        remove: string;
        tokenTracker: string;
        tokenIcon: string;
        sourceCode: string;
        abi: string;
        constructorArgs: string;
        constructorArgsTips: string;
        libraryContracts: string;
        encodedView: string;
        decodedView: string;
        enterPassword: string;
        contractAdmin: string;
        creator: string;
        storageSponsor: string;
        gasSponsor: string;
        create: {
            title: string;
        };
        edit: {
            title: string;
        };
        updateContract: string;
        updateToken: string;
        verify: {
            contractCodeVerified: string;
            contractName: string;
            optimizationEnabled: string;
            otherSettings: string;
            evmVersion: string;
            license: string;
            compilerVersion: string;
            runs: string;
            tipLeft: string;
            tipCenter: string;
            tipRight: string;
            isVerifiedTip: string;
        };
        code: string;
        sourceCodeShort: string;
        sourceCodeFilename: string;
        abiShort: string;
        maxSize: string;
        supportType: string;
        namePlaceholder: string;
        requiredAddress: string;
        requiredNameTag: string;
        sitePlaceholder: string;
        invalidContractAddress: string;
        invalidNameTag: string;
        duplicatedNameTag: string;
        invalidUrl: string;
        errorNotAdmin: string;
        invalidIconSize: string;
        invalidIconType: string;
        errorTokenICon: string;
        beforeContractSubmitTip: string;
        invalidJsonAbi: string;
        abiNotUploaded: string;
        abiError: string;
        readContract: string;
        writeContract: string;
        readAsProxyContract: string;
        writeAsProxyContract: string;
        readContractInformation: string;
        writeContractInformation: string;
        noReadContract: string;
        noWriteContract: string;
        notVerifyImplementContract: string;
        pattern: string;
        expandAll: string;
        reset: string;
        payableAmountCfx: string;
        error: {
            address: string;
            bool: string;
            int: string;
            uint: string;
            bytes: string;
            bytesM: string;
            cfx: string;
            array: string;
            tuple: string;
            tupleArray: string;
            notSupport: string;
            testnet: string;
            mainnet: string;
        };
        tupleFormat: string;
        tupleTips: string;
        query: string;
        write: string;
        viewTx: string;
        collapseAll: string;
    };
    contractDeployment: {
        title: string;
        description: string;
        tip: string;
        notice: {
            first: string;
            second: string;
            third: string;
        };
    };
    contractVerification: {
        title: string;
        description: string;
        tip: string;
        notice: {
            first: string;
            second: string;
            third: string;
            fourth: string;
        };
        upload: string;
        submit: string;
        contractAddress: string;
        runs: string;
        contractName: string;
        compiler: string;
        optimization: string;
        license: string;
        evmVersion: string;
        contractLibraryAddress: string;
        contractLibraryAddressTip: string;
        libraryName: string;
        libraryContractAddress: string;
        contractSourceCode: string;
        error: {
            required: string;
            min: string;
            isNotAddress: string;
            isNotMainnet: string;
            isNotTestnet: string;
            pleaseSelect: string;
            pleaseEnter: string;
            notMatch: string;
        };
        OptimizationOption: {
            yes: string;
            no: string;
        };
        placeholder: {
            contractAddress: string;
            runs: string;
            contractName: string;
            compiler: string;
            optimization: string;
            license: string;
            contractSourceCode: string;
        };
        status: {
            loading: string;
            success: string;
            error: string;
        };
    };
    contractDetail: {
        title: string;
        content: string;
        contractAdminWarning: string;
        at: string;
        txOnlyEn: string;
        txOnlyZh: string;
        clickToApply: string;
        clickToReport: string;
        notDeployed: string;
    };
    addressDetail: {
        minedBlocks: string;
        NFTAsset: string;
        title: string;
        content: string;
        staked: string;
        stakingEarned: string;
        locked: string;
        unlockTime: string;
        lockedDetailTitle: string;
        lockedDetailLocked: string;
        lockedDetailUnlockBlockNumber: string;
        lockedDetailUnlockTime: string;
        currentVotingRights: string;
        apy: string;
        viewLockedDetails: string;
        pos: {
            identifier: string;
            totalStakedRights: string;
            totalInterests: string;
            unlockRights: string;
            lockedRights: string;
        };
    };
    blocks: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        latestBlocks: string;
    };
    transactions: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        latestTransactions: string;
        pending: string;
        executed: string;
        pendingTxnGasFee: string;
        executedTotal: string;
        pendingTotalLt10: string;
        pendingTotal: string;
        pendingTip: string;
        pendingReasonTip: string;
        viewTxn: string;
    };
    cfxTransfers: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    tokens: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        dataSource: string;
        crcTip: string;
        table: {
            number: string;
            token: string;
            transfer: string;
            totalSupply: string;
            holders: string;
            price: string;
            change: string;
            volume: string;
            marketCap: string;
            contract: string;
        };
    };
    accounts: {
        title: string;
        description: string;
        tipLeft: string;
        tipRight: string;
        totalBalance: string;
        stakingBalance: string;
        balance: string;
        sortButtonBefore: string;
        sortButtonAfter: string;
        table: {
            number: string;
            address: string;
            balance: string;
            percentage: string;
            count: string;
        };
        downloadButtonText: string;
    };
    contracts: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    registeredContracts: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    header: {
        approval: string;
        cns: string;
        home: string;
        bnt: string;
        block: string;
        txn: string;
        cfxTransfers: string;
        blockchain: string;
        accounts: string;
        tokens: string;
        tokens20: string;
        tokens721: string;
        tokens1155: string;
        contract: string;
        contractCreation: string;
        contractSponsor: string;
        contractDeployment: string;
        contractVerification: string;
        contracts: string;
        chartsAndStatistics: string;
        ecosystem: string;
        stakingAndGovernance: string;
        developerAPI: string;
        fcCfx: string;
        crossSpace: string;
        more: string;
        tools: string;
        balanceChecker: string;
        charts: string;
        posCharts: string;
        nftCharts: string;
        crossSpaceCharts: string;
        statistics: string;
        support: string;
        faq: string;
        feedback: string;
        techIssue: string;
        report: string;
        supportCenter: string;
        suggestionBox: string;
        testnet: string;
        oceanus: string;
        searchPlaceHolder: string;
        searchPlaceHolderMobile: string;
        searchPlaceHolderWithWeb3: string;
        searchPlaceHolderMobileWithWeb3: string;
        addressConverter: string;
        faucet: string;
        broadcastTx: string;
        blocknumberCalc: string;
        nftChecker: string;
        nftDetail: string;
        notice: string;
        search: {
            ens: string;
            tokens: string;
            contracts: string;
            contractsTip: string;
            nametag: string;
        };
        pos: {
            posNickname: string;
            pos: string;
            overview: string;
            accounts: string;
            blocks: string;
            transactions: string;
            committee: string;
            incomingRank: string;
        };
        profile: string;
    };
    footer: {
        currency: {
            usd: string;
            cny: string;
            gbp: string;
            krw: string;
            rub: string;
            eur: string;
        };
        aboutUs: {
            title: string;
            supportCenter: string;
            privacyPolicy: string;
            terms: string;
        };
        cookie: string;
        addressWarning: string;
        cookieAgree: string;
        product: string;
        confluxnetwork: string;
        fluentwallet: string;
        confluxbounty: string;
        hub: string;
        global: string;
        copryRight: string;
        tool: string;
        addressFormatConversion: string;
        broadcastTx: string;
        blocknumberCalc: string;
        preference: string;
        contactUs: string;
        techIssue: string;
        report: string;
        suggestionBox: string;
        developResource: {
            title: string;
            developerDocuments: string;
            developerAPI: string;
            confluxStudio: string;
            confluxTruffle: string;
        };
    };
    packing: {
        title: string;
        btn: string;
    };
    notFound: {
        title: string;
        label: string;
        addressTip: string;
        btn: string;
    };
    notFoundAddress: {
        title: string;
        label: string;
        btn: string;
        defaultType: string;
        contract: string;
        block: string;
        transaction: string;
    };
    networkError: {
        title: string;
        label: string;
        btn: string;
    };
    token: {
        website: string;
        token: string;
        totalSupplay: string;
        contract: string;
        holders: string;
        decimals: string;
        transfers: string;
        analysis: string;
        price: string;
        change: string;
        volume: string;
        marketCap: string;
        shuttleflow: string;
        fcMining: string;
        notRegistered: string;
        tokenRegistration: string;
        transferList: {
            searchError: string;
            balance: string;
        };
        NFT: string;
        total: string;
        tokens: string;
        sortBy: string;
        recentlyActive: string;
        newest: string;
        oldest: string;
    };
    highcharts: {
        subtitle: string;
        nft: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                assets: string;
                holders: string;
                contracts: string;
                transfers: string;
            };
            assets: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            holders: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            contracts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            transfers: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
        };
        crossSpace: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                "daily-cfx-transfer": string;
                "daily-cfx-transfer-count": string;
                contract: string;
            };
            dailyCFXTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            dailyCFXTransferCount: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
        };
        pos: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                "finalized-interval": string;
                "daily-accounts": string;
                "daily-staking": string;
                "daily-apy": string;
                "total-reward": string;
                "daily-reward-rank": string;
                "daily-reward-info": string;
                "daily-deposit": string;
                "participation-rate": string;
            };
            finalizedInterval: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            dailyAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            dailyStaking: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            apy: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            totalReward: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            dailyRewardRank: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                PoSAddress: string;
                PoWAddress: string;
                reward: string;
            };
            dailyRewardInfo: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            dailyDeposit: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            participation: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
        };
        pow: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
                marketData: string;
                blockchainData: string;
                transaction: string;
                account: string;
                contracts: string;
            };
            breadcrumb: {
                charts: string;
                blocktime: string;
                tps: string;
                hashrate: string;
                difficulty: string;
                supply: string;
                circulating: string;
                tx: string;
                "token-transfer": string;
                "cfx-transfer": string;
                "cfx-holder-accounts": string;
                "account-growth": string;
                "active-accounts": string;
                contracts: string;
            };
            averageBlockTime: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            tps: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            hashRate: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            difficulty: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            totalSupply: {
                title: string;
                subtitle: string;
                fourYearUnlock: string;
                twoYearUnlock: string;
                circulatingSupply: string;
                zeroAddress: string;
            };
            circulatingSupply: {
                title: string;
                subtitle: string;
                others: string;
                totalCollateral: string;
                totalStaking: string;
            };
            tx: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            cfxTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            tokenTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            CFXHolderAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            accountGrowth: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            activeAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            contracts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            contract: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            token: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
                yAxisTitle4: string;
                seriesName4: string;
            };
        };
        options: {
            time: string;
            range: string;
        };
    };
    charts: {
        title: string;
        subtitle1: string;
        subtitle2: string;
        subtitle3: string;
        subtitle4: string;
        subtitle5: string;
        description: string;
        tps: {
            title: string;
            description: string;
        };
        tokenTransferTps: {
            title: string;
            description: string;
        };
        blockTime: {
            title: string;
            description: string;
        };
        difficulty: {
            title: string;
            description: string;
        };
        hashRate: {
            title: string;
            description: string;
        };
        cfxPrice: {
            title: string;
            description: string;
        };
        cfxMarketCap: {
            title: string;
            description: string;
        };
        issued: {
            title: string;
            description: string;
            labelFourYearUnlockBalance: string;
            labelTwoYearUnlockBalance: string;
            labelTotalCirculating: string;
        };
        zeroAddress: {
            title: string;
            description: string;
        };
        dailyTransaction: {
            title: string;
            description: string;
        };
        dailyTransactionCFX: {
            title: string;
            description: string;
            amount: string;
            txnCount: string;
            userCount: string;
        };
        dailyTransactionTokens: {
            title: string;
            description: string;
            txnCount: string;
            userCount: string;
        };
        cfxHoldingAccounts: {
            title: string;
            description: string;
        };
        activeAccounts: {
            title: string;
            description: string;
        };
        accountGrowth: {
            title: string;
            description: string;
        };
        contractGrowth: {
            title: string;
            description: string;
        };
        contractAmount: {
            title: string;
            description: string;
        };
        contractDeploy: {
            title: string;
            description: string;
            contractCount: string;
            contractTotalCount: string;
        };
        tokenAnalysis: {
            title: string;
            description: string;
            transferAmount: string;
            transferCount: string;
            uniqueReceiver: string;
            uniqueSender: string;
        };
        contractAnalysis: {
            title: string;
            description: string;
            tx: string;
            cfxTransfer: string;
            tokenTransfer: string;
        };
    };
    general: {
        fold: string;
        expand: string;
        refresh: string;
        timestamp: string;
        create: string;
        edit: string;
        delete: string;
        buttonCancel: string;
        buttonOk: string;
        warning: string;
        deleteTip: string;
        exceedTip: string;
        networks: {
            mainnet: string;
            testnet: string;
            privatenet: string;
        };
        errors: {
            address: string;
        };
        advancedSearch: {
            label: {
                txnHash: string;
                blockHash: string;
                fromOrTo: string;
                address: string;
                from: string;
                to: string;
                tokenId: string;
                nonce: string;
                token: string;
                tokenSubTitle: string;
                rangePicker: string;
                epochNumber: string;
                minEpochNumber: string;
                maxEpochNumber: string;
            };
            error: {
                invalidHash: string;
                invalidAddress: string;
            };
            placeholder: {
                pleaseSelect: string;
                pleaseEnter: string;
                pleaseEnterTxnHash: string;
                pleaseEnterBlockHash: string;
                pleaseEnterTokenId: string;
                pleaseEnterNonce: string;
                pleaseEnterEpochStart: string;
                pleaseEnterEpochEnd: string;
            };
            button: {
                lookup: string;
                reset: string;
            };
            others: {
                recommend: string;
                recommendTip: string;
                searchResult: string;
                noData: string;
            };
        };
        tokenTypeTag: {
            token: string;
        };
        searchInputPlaceholder: {
            txnHash: string;
            address: string;
            holderAddress: string;
            tokenID: string;
            blockHash: string;
            epoch: string;
        };
        totalRecord: string;
        totalRecord_plural: string;
        totalRecordWithLimit: string;
        totalRecordWithType: string;
        totalRecordWithLimitWithType: string;
        totalHolders: string;
        totalRecordLimit: string;
        remark: string;
        invalidBytecode: string;
        invalidABI: string;
        invalidJsonFile: string;
        importJsonFile: string;
        showLess: string;
        viewMore: string;
        viewAll: string;
        viewAllBlocks: string;
        viewAllTxns: string;
        viewAllPosAccounts: string;
        viewAllPosCommittees: string;
        back: string;
        address: {
            editContract: string;
            website: string;
            address: string;
            more: {
                title: string;
                report: string;
                editContract: string;
                editToken: string;
                sponsor: string;
                website: string;
                balanceChecker: string;
                verifyContract: string;
                NFTChecker: string;
                addLabel: string;
                updateLabel: string;
            };
        };
        loading: string;
        contract: string;
        verifiedContract: string;
        unverifiedContract: string;
        internalContract: string;
        specialAddress: string;
        zeroAddress: string;
        invalidAddress: string;
        eSpaceAddress: string;
        invalidPosAddress: string;
        invalidAddressWarning: string;
        balance: string;
        token: string;
        abnormalToken: string;
        storageStaking: string;
        nonce: string;
        transaction: string;
        transactions: string;
        tokenTxns: string;
        cfxTransfer: string;
        tokenTxnsErc20: string;
        tokenTxnsErc721: string;
        tokenTxnsErc1155: string;
        table: {
            noData: string;
            whoops: string;
            dateTime: string;
            switchAgeTip: string;
            block: {
                epoch: string;
                position: string;
                txns: string;
                hash: string;
                miner: string;
                avgGasPrice: string;
                gasUsedPercent: string;
                reward: string;
                age: string;
                difficulty: string;
                gasLimit: string;
            };
            transaction: {
                hash: string;
                method: string;
                from: string;
                to: string;
                value: string;
                gasPrice: string;
                gasFee: string;
                age: string;
                pendingReason: string;
            };
            token: {
                number: string;
                token: string;
                price: string;
                change: string;
                volume: string;
                marketCap: string;
                transfer: string;
                totalSupply: string;
                holders: string;
                contract: string;
                txnHash: string;
                age: string;
                from: string;
                fromType: string;
                fromTypeIn: string;
                fromTypeOut: string;
                fromTypeArrow: string;
                to: string;
                accountAddress: string;
                tokenId: string;
                details: string;
                view: string;
                quantity: string;
                erc1155QuantityTip: string;
                percentage: string;
                traceType: string;
                traceOutcome: string;
                traceResult: string;
                traceStatusTitle: string;
                traceStatus: {
                    success: string;
                    fail: string;
                    revert: string;
                };
                projectInfo: {
                    projectInfo: string;
                    security: string;
                    verify: string;
                    unverify: string;
                    audit: string;
                    sponsor: string;
                    zeroAddress: string;
                    notZeroAddress: string;
                    listedByCentralized: string;
                    listedByDecentralized: string;
                    listedByCMC: string;
                    blackList: string;
                    modal: {
                        security: string;
                        verify: string;
                        unverify: string;
                        unaudit: string;
                        audit: string;
                        sponsor: string;
                        zeroAddress: string;
                        notZeroAddress: string;
                        uncex: string;
                        cex: string;
                        binance: string;
                        huoBi: string;
                        ok: string;
                        undex: string;
                        dex: string;
                        moonswap: string;
                        uncmc: string;
                        cmc: string;
                        remarkTitle: string;
                        remarkContent1: string;
                        remarkContent2: string;
                        remarkContent3: string;
                        remarkContent4: string;
                        disclaimer: string;
                    };
                };
            };
            contracts: {
                number: string;
                name: string;
                address: string;
                transactionCount: string;
            };
        };
        pagination: {
            labelPageSizeBefore: string;
            labelPageSizeAfter: string;
            labelJumperBefore: string;
            labelJumperAfter: string;
        };
        copyButton: {
            copyToClipboard: string;
            success: string;
            failed: string;
        };
        submit: string;
        apply: string;
        search: string;
        qrcodeButton: {
            clickToShow: string;
            contract: string;
            address: string;
            scanQRCode: string;
        };
        notAvailable: string;
        noResult: string;
        security: {
            notAvailable: string;
            finalized: string;
            high: string;
            medium: string;
            low: string;
            veryLow: string;
        };
        status: {
            skip: {
                text: string;
                explanation: string;
            };
            error: {
                text: string;
                explanation: string;
            };
            success: {
                text: string;
                explanation: string;
            };
            unexecuted: {
                text: string;
                explanation: string;
            };
            pending: {
                text: string;
                explanation: string;
            };
        };
        countdown: {
            year: string;
            year_plural: string;
            month: string;
            month_plural: string;
            day: string;
            day_plural: string;
            hour: string;
            hour_plural: string;
            minute: string;
            minute_plural: string;
            second: string;
            second_plural: string;
            ago: string;
        };
        startDate: string;
        endDate: string;
        submitSucceed: string;
        tabLabel: {
            lt10000: string;
            gte10000: string;
        };
        errorOccurred: string;
        error: {
            title: string;
            detail: string;
            description: {
                "20000": string;
                "20001": string;
                "20002": string;
                "20003": string;
                "20004": string;
                "30001": string;
                "50001": string;
                "50100": string;
                "50101": string;
                "50102": string;
                "50103": string;
                "50104": string;
                "50105": string;
                "50200": string;
                "50201": string;
                "50202": string;
                "50300": string;
                "50301": string;
                "50302": string;
                "50303": string;
                "50400": string;
                "50401": string;
                "50500": string;
                "50501": string;
                "50600": string;
                "50601": string;
                "50602": string;
                "50603": string;
                "50604": string;
                "50605": string;
                "50700": string;
                "50701": string;
                "50702": string;
                "50703": string;
                "50704": string;
                "60002": string;
                "400": string;
                "401": string;
                "403": string;
                "404": string;
                "405": string;
                "500": string;
                "501": string;
                "502": string;
                "503": string;
                "504": string;
            };
        };
        connnectWalletSubmit: string;
        waitForConfirm: string;
        txRejected: string;
        exportRecords: string;
        downloadCSV: {
            latest5000records: string;
            download: string;
            csvFile: string;
        };
        preview: string;
        yes: string;
        no: string;
    };
    sponsor: {
        title: string;
        storageSponsor: string;
        gasFeeSponsor: string;
        currentAvialStorageFee: string;
        currentAvialStorageQuota: string;
        currentAvialGasFee: string;
        providedStorage: string;
        providedGas: string;
        availStorage: string;
        availGas: string;
        connectToApply: string;
        notice: string;
        noticeFirst: string;
        noticeSecond: string;
        noticeThird: string;
        errReachToMax: string;
        errInsufficientFee: string;
        errReplaceThird: string;
        errContractNotFound: string;
        errCannotReplaced: string;
        errUpgraded: string;
        upperBound: string;
        submitted: string;
        txHash: string;
        searchAddress: string;
        applicationUnit: string;
        tx: string;
        byFoundation: string;
        storage: {
            used: string;
            quota: string;
            point: string;
            collateral: string;
            example: string;
            desc: string;
        };
    };
    transaction: {
        note: string;
        addNote: string;
        updateNote: string;
        pendingReasonLink: string;
        tipOfTokenTransferCount: string;
        gotoDetail: string;
        inThePosition: string;
        overview: string;
        viewOutgoingTxns: string;
        viewIncomingTxns: string;
        viewFailedTxns: string;
        viewCreationTxns: string;
        title: string;
        description: string;
        hash: string;
        executedEpoch: string;
        proposedEpoch: string;
        timestamp: string;
        status: string;
        from: string;
        to: string;
        tokenTransferred: string;
        value: string;
        gasUsed: string;
        gasPrice: string;
        gasFee: string;
        gasCharged: string;
        nonce: string;
        blockHash: string;
        position: string;
        storageLimit: string;
        storageCollateralized: string;
        storageReleased: string;
        chainID: string;
        inputData: string;
        select: {
            decodeInputData: string;
            original: string;
            utf8: string;
            json: string;
            generalDecode: string;
            optimizationDecode: string;
        };
        contract: string;
        created: string;
        contractCreation: string;
        for: string;
        tokenId: string;
        inputTips: string;
        epochConfirmations: string;
        statusError: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
        };
        internalTxns: {
            title: string;
            simple: string;
            advanced: string;
        };
        internalTxnsTip: {
            from: string;
            to: string;
            produced: string;
            txns: string;
            tip: string;
        };
        logs: {
            title: string;
            address: string;
            name: string;
            topics: string;
            data: string;
            decode: string;
            hex: string;
            text: string;
            number: string;
        };
        pending: {
            view: string;
            detail: string;
            tip: string;
            reference: string;
            link: string;
        };
        pendingDetails: {
            futrueNonce: {
                summary: string;
                detail: string;
                tip: string;
            };
            notEnoughCash: {
                summary: string;
                contractCreateAndToEOA: {
                    detail: string;
                    tip: string;
                };
                toContract: {
                    detail: string;
                    tip: string;
                    reason: {
                        notSponsored: string;
                        exceedUpperBound: string;
                        exceedGasFeeBalance: string;
                        exceedStorageFeeBalance: string;
                    };
                };
                original: {
                    detail: string;
                    tip: string;
                };
            };
            readyToPack: {
                summary: string;
                epochExceed: {
                    detail: string;
                    tip: string;
                };
                lowGasPrice: {
                    detail: string;
                    tip: string;
                };
            };
            tooOldEpoch: {
                summary: string;
                detail: string;
                tip: string;
            };
            fullnodeInnerError: {
                summary: string;
                detail: string;
                tip: string;
            };
        };
        action: {
            title: string;
            tooltip: string;
        };
    };
    block: {
        overview: string;
        title: string;
        description: string;
        blockHeight: string;
        epoch: string;
        difficulty: string;
        miner: string;
        reward: string;
        security: string;
        blame: string;
        blockHash: string;
        posBlockHash: string;
        parentHash: string;
        nonce: string;
        gasUsed: string;
        timestamp: string;
        size: string;
        transactions: string;
        referenceBlocks: string;
        tabs: {
            transactions: string;
            referenceBlocks: string;
            labelCountBefore: string;
            labelCountAfter: string;
        };
    };
    epoch: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        labelCountBefore: string;
        labelCountAfter: string;
        blocks: string;
        transactions: string;
        table: {
            position: string;
            hash: string;
            txns: string;
            miner: string;
            difficulty: string;
            gasUsedPercent: string;
            gasLimit: string;
            age: string;
        };
    };
    addressConverter: {
        title: string;
        subtitle: string;
        button: string;
        inputPlaceholder: string;
        networkId: string;
        incorrectFormat: string;
        lowercase: string;
        checksum: string;
        newMainnetAddress: string;
        newTestnetAddress: string;
        newCustomnetAddress: string;
        remark: string;
        tip1: string;
        tip2: string;
        tip3: string;
        tip3Link: string;
        tip3end: string;
        tip5: string;
        tip5Link: string;
        tip5Middle: string;
        tip5end: string;
        tip4: string;
        errorMessage: {
            "0x0": string;
            "0x8": string;
            notSupport: string;
        };
        warning: string;
        warnings: {
            one: string;
            two: string;
            three: string;
            four: string;
        };
    };
    broadcastTx: {
        title: string;
        subtitle: string;
        broadcastBtn: string;
        success: string;
        error: string;
        unknownError: string;
    };
    blocknumberCalc: {
        title: string;
        placeholder: string;
        higherError: string;
        calcBtn: string;
        currentBlocknumber: string;
        remainingBlocks: string;
        targetDate: string;
        day: string;
        hour: string;
        min: string;
        sec: string;
    };
    notice: {
        mainnet: string[];
        testnet: string[];
        link: string;
        testnetLink: string;
    };
    toolTip: {
        block: {
            blockHeight: string;
            epoch: string;
            difficulty: string;
            miner: string;
            reward: string;
            security: string;
            blame: string;
            blockHash: string;
            posBlockHash: string;
            parentHash: string;
            nonce: string;
            gasUsedLimit: string;
            timestamp: string;
            size: string;
            transactions: string;
            referenceBlocks: string;
        };
        tx: {
            transactionHash: string;
            executedEpoch: string;
            proposedEpoch: string;
            timestamp: string;
            status: string;
            security: string;
            from: string;
            to: string;
            tokenTransferred: string;
            value: string;
            gasUsedLimit: string;
            gasPrice: string;
            gasFee: string;
            gasLimitTip: string;
            gasUsedTip: string;
            gasChargedip: string;
            gasCharged: string;
            nonce: string;
            blockHash: string;
            position: string;
            storageLimit: string;
            storageCollateralized: string;
            storageReleased: string;
            chainID: string;
            inputData: string;
        };
        address: {
            balance: string;
            token: string;
            storageCollateral: string;
            nonce: string;
            stakedBegin: string;
            stakedEnd: string;
            stakingEarned: string;
            lockedBegin: string;
            lockedEnd: string;
            currentVotingRights: string;
        };
        token: {
            price: string;
            volume: string;
            marketCap: string;
            fullyDilutedMarketCap: string;
            totalSupply: string;
            holders: string;
            transfers: string;
            contract: string;
            decimals: string;
        };
        contract: {
            balance: string;
            token: string;
            storageCollateral: string;
            nameTag: string;
            tokenTracker: string;
            contractCreator: string;
            contractAdmin: string;
            storageSponsor: string;
            gasFeeSponsor: string;
        };
    };
    connectWallet: {
        button: {
            connectWallet: string;
            nPending: string;
            wrongNetwork: string;
            switchNetwork: string;
        };
        modal: {
            title: string;
            installFluentWallet: string;
            fluentWallet: string;
            initializing: string;
            errorConnecting: string;
            tryAgain: string;
            newToConflux: string;
            learnMore: string;
            account: string;
            connectedWithFluentWallet: string;
            copyAddress: string;
            viewOnConfluxScan: string;
            networkNotice: string;
            addressNotice: string;
            switchToMainnet: string;
            switchToTestnet: string;
            switchToScanNetwork: string;
            cannotProcess: string;
            upgradeTipAddress: string;
        };
        history: {
            emptyRecordsTip: string;
            recentlyRecordsTip: string;
            clearAll: string;
            recentlyTenRecordsTip: string;
            contractCreation: string;
            contractEdit: string;
            sponsorApplication: string;
            writeContract: string;
            viewYourtransaction: string;
        };
        notify: {
            link: string;
            action: {
                "100": string;
                "101": string;
                "102": string;
                "103": string;
                "104": string;
                "105": string;
                "106": string;
                "107": string;
                "108": string;
                "109": string;
                "110": string;
                "111": string;
                "112": string;
                "113": string;
                "114": string;
                "115": string;
            };
        };
        tip: string;
    };
    statistics: {
        statistics: string;
        overview: string;
        transactions: string;
        tokens: string;
        miners: string;
        network: string;
        overviewTransactions: string;
        overviewTokens: string;
        overviewMiners: string;
        overviewNetwork: string;
        overviewMore: string;
        topTxnCountSent: string;
        topTxnCountReceived: string;
        topCFXSend: string;
        topCFXReceived: string;
        topTokensBySenders: string;
        topTokensByReceivers: string;
        topTokensByTxnCount: string;
        topTokensByTxnAccountsCount: string;
        topMinersByBlocksMined: string;
        topAccountsByGasUsed: string;
        topAccountsByTxnCount: string;
        valueInTotal: string;
        txnCountInTotal: string;
        span: {
            "24h": string;
            "3d": string;
            "7d": string;
        };
        overviewColumns: {
            totalCFXSent: string;
            totalCFXReceived: string;
            totalTxnCount: string;
            totalTxnCountSent: string;
            totalTxnCountReceived: string;
            totalTokenSent: string;
            totalTokenReceived: string;
            totalTokenTransfersCount: string;
            totalTokenTransfersAccountsCount: string;
            totalMiners: string;
            highestNodes: string;
            totalBlocksMined: string;
            totalGasUsed: string;
            top10: string;
        };
        column: {
            rank: string;
            address: string;
            txn: string;
            txnValue: string;
            txnAccounts: string;
            percentage: string;
            token: string;
            senders: string;
            receivers: string;
            totalBlocksMined: string;
            totalRewards: string;
            totalTxnFees: string;
            hashRate: string;
            gasUsed: string;
        };
        home: {
            currentBlockNumber: string;
            currentEpoch: string;
            account: string;
            transactions: string;
            contract: string;
            minerCount: string;
            gasUsed: string;
        };
        pos: {
            finalizedEpoch: string;
            currentBlockNumber: string;
            totalLocked: string;
            totalInterest: string;
            lastInterestDistributionDate: string;
            lastInterestDistributionEpoch: string;
            totalAccountCount: string;
            votingBlock: string;
            apy: string;
            apyTip: string;
        };
    };
    swap: {
        swap: string;
        from: string;
        to: string;
        balance: string;
        availableBalance: string;
        availableBalanceTip: string;
        connectWallet: string;
        enterAmount: string;
        insufficientBalance: string;
        max: string;
        selectAToken: string;
        cfx: string;
        wcfx: string;
        swapNCFXToWCFX: string;
        swapNWCFXToCFX: string;
    };
    report: {
        title: string;
        subtitle: string;
        address: string;
        txnHash: string;
        selectType: string;
        phishHack: string;
        scam: string;
        fishy: string;
        highRisk: string;
        spam: string;
        others: string;
        description: string;
        tip: string;
        nCharacters: string;
        code: string;
        submit: string;
        error: {
            addressRequired: string;
            addressInvalid: string;
            typeRequired: string;
            descriptionRequired: string;
            recaptchaRequired: string;
            txnHashInvalid: string;
            isNotMainnet: string;
            isNotTestnet: string;
        };
        status: {
            success: string;
            fail: string;
        };
    };
    balanceChecker: {
        tokenBalanceChecker: string;
        balanceChecker: string;
        subtitle: string;
        tokenQuantity: string;
        tokenSupply: string;
        cfxBalance: string;
        address: string;
        contractAddress: string;
        epochNoOrDate: string;
        or: string;
        chooseDate: string;
        enterEpochNo: string;
        invalidEpochNo: string;
        error: string;
        lookUp: string;
        reset: string;
        tokenQuantityForAccountAddress: string;
        totalSupplyForContractAddress: string;
        cfxBalanceForAddress: string;
        snapshotDate: string;
        epoch: string;
        epochNo: string;
    };
    cns: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        cns: string;
        resolvedAddress: string;
        expires: string;
        registrant: string;
        controller: string;
        owner: string;
        tokenid: string;
        address: string;
        reverseRecord: string;
        ownedCoreids: string;
        name: string;
        errors: {
            cns: string;
            address: string;
            invalidText: string;
        };
    };
    approval: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        txHash: string;
        token: string;
        tokenType: string;
        amount: string;
        contract: string;
        operation: string;
        timestamp: string;
        revoke: string;
        view: string;
        unlimited: string;
        tips: {
            support: string;
            view: string;
            success: string;
            failed: string;
        };
        select: {
            all: string;
            ERC20: string;
            ERC721: string;
            ERC1155: string;
        };
        cns: string;
        address: string;
        resolvedAddress: string;
        expires: string;
        registrant: string;
        controller: string;
        owner: string;
        tokenid: string;
        reverseRecord: string;
        ownedCoreids: string;
        name: string;
        errors: {
            invalidAddress: string;
            cns: string;
            address: string;
            invalidText: string;
        };
    };
    nftChecker: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        incorrectFormat: string;
        incorrectAddressType: string;
        tokenId: string;
        plzSearch: string;
        plzSearchDesc: string;
        owner: string;
        amount: string;
    };
    pos: {
        common: {
            right: string;
            posAddress: string;
            powAddress: string;
            powBlockHash: string;
            posBlockHash: string;
            txStatus: {
                Executed: string;
                Discard: string;
                Failed: string;
            };
            txType: {
                BlockMetadata: string;
                Election: string;
                Retire: string;
                Dispute: string;
                Register: string;
                Other: string;
                UpdateVotingPower: string;
                PivotDecision: string;
            };
            txPayload: {
                vrfPublicKey: string;
                publicKey: string;
                targetTerm: string;
                vrfProof: string;
                address: string;
                votingPower: string;
                height: string;
                blockHash: string;
                blsPublicKey: string;
                conflictingVotes: string;
                conflictVoteType: string;
                proposal: string;
                vote: string;
                first: string;
                second: string;
            };
            committeeStatus: {
                electionInProgress: string;
                electionCompleted: string;
                Ongoing: string;
                termEnd: string;
            };
            votingStatus: {
                voted: string;
                committed: string;
            };
        };
        accounts: {
            title: string;
            description: string;
            address: string;
            availableVotes: string;
            currentCommitteeMember: string;
            votesInCommittee: string;
            registerDate: string;
        };
        account: {
            title: string;
            description: string;
            overview: {
                title: string;
                posAddress: string;
                lockingRights: string;
                lockedRights: string;
                unlockingRights: string;
                unlockRights: string;
                retiredBlocknumber: string;
                availableVotes: string;
                currentCommitteeMember: string;
                rightsInCommittee: string;
                unlockedVotes: string;
                totalIncoming: string;
                punishment: string;
                timestamp: string;
            };
            incomingHistory: {
                title: string;
                powBlockHash: string;
                incoming: string;
                timstamp: string;
            };
            votingHistory: {
                title: string;
                blcokHeight: string;
                blockHash: string;
                votes: string;
                timestamp: string;
            };
            votingStatus: {
                title: string;
                rights: string;
                status: string;
                in: string;
                out: string;
                blockNumberDeadline: string;
            };
        };
        blocks: {
            title: string;
            description: string;
            blockHeight: string;
            blockHash: string;
            txn: string;
            poSMinerAddress: string;
            timestamp: string;
        };
        block: {
            title: string;
            description: string;
            overview: {
                title: string;
                blockHash: string;
                blockNumber: string;
                epoch: string;
                minerAddress: string;
                timestamp: string;
                status: string;
                powBlockHash: string;
            };
            transactions: {
                title: string;
            };
            votingAddress: {
                title: string;
                votingNumber: string;
            };
        };
        transactions: {
            title: string;
            description: string;
            poSTxnHash: string;
            poSBlockHash: string;
            status: string;
            succeed: string;
            failed: string;
            discard: string;
            type: string;
            election: string;
            retire: string;
            committeeJoin: string;
            register: string;
            pivotDecision: string;
            dispute: string;
            blockMatadata: string;
            other: string;
            timstamp: string;
        };
        transaction: {
            title: string;
            description: string;
            overview: {
                title: string;
                hash: string;
                status: string;
                type: string;
                timestamp: string;
                number: string;
                blockHash: string;
                blockNumber: string;
                payload: string;
            };
        };
        committees: {
            title: string;
            description: string;
            committeeEpoch: string;
            status: string;
            numberOfMembers: string;
            totalVotes: string;
        };
        committee: {
            title: string;
            description: string;
            overview: {
                title: string;
                committeeEpoch: string;
                status: string;
                totalVotes: string;
                consensusVotes: string;
            };
            votesDistribution: {
                title: string;
                votes: string;
            };
        };
        incomingRank: {
            title: string;
            description: string;
            subTitle: string;
            totalIncoming: string;
            top100: string;
            last30days: string;
            rewardRank: {
                id: string;
                day: string;
                day_plural: string;
                all: string;
            };
        };
    };
    gaspriceDropdown: {
        blockHeight: string;
        low: string;
        median: string;
        high: string;
        market: string;
        latest60Blocks: string;
    };
};
declare const ENV_LOCALES_CN: {
    nametag: {
        label: string;
        tip: string;
    };
    ens: {
        label: string;
        tip: string;
    };
    profile: {
        title: string;
        subtitle: string;
        tip: {
            label: string;
            note: string;
        };
        tx: {
            title: string;
            hash: string;
            note: string;
            search: string;
            error: {
                invalidHash: string;
                invalidNote: string;
                invalidNoteRange: string;
                hash: string;
                note: string;
                duplicated: string;
            };
        };
        address: {
            title: string;
            address: string;
            label: string;
            search: string;
            error: {
                invalidAddress: string;
                invalidNetwork: string;
                invalidLabel: string;
                invalidLabelRange: string;
                address: string;
                label: string;
                duplicated: string;
                duplicatedNameTag: string;
            };
            publicNameTag: string;
            myNameTag: string;
        };
        file: {
            error: {
                invalid: string;
                fileChanged: string;
                chainIdError: string;
            };
            export: {
                button: string;
                tip: string;
                complete: string;
                failed: string;
            };
            import: {
                button: string;
                tip: string;
                complete: string;
                failed: string;
                address: string;
                tx: string;
            };
        };
    };
    metadata: {
        title: string;
        description: string;
    };
    NFTAsset: {
        totalOf721: string;
        totalOf1155: string;
        listLimit: string;
    };
    nftDetail: {
        title: string;
        details: string;
        metadata: string;
        description: string;
        id: string;
        name: string;
        type: string;
        address: string;
        contractInfo: string;
        contractInfoTip: string;
        owner: string;
        url: string;
        creator: string;
        mintedTime: string;
        transfer: string;
        from: string;
        to: string;
        amount: string;
        amountTip: string;
        error: {
            fromAddress: string;
            toAddress: string;
            amount: string;
            id: string;
            invalidAddress: string;
            invalidNetwork: string;
            invalidAmount: string;
        };
        refreshTip: string;
        trait: string;
        datetime: string;
    };
    fccfx: {
        title: string;
        titleAccountInfo: string;
        titleStakeAndSign: string;
        titleWithdrawCFX: string;
        titleMyNFT: string;
        rulesLink: string;
        titleGenerate: string;
        titleAPY: string;
        titleStakedFC: string;
        titleStakedHistory: string;
        titleFCStaked: string;
        titleFCUnsigned: string;
        titleFCStakedHistory: string;
        titleCFXWithdrawed: string;
        titleAvailableProfit: string;
        titleRemainingInterests: string;
        titleStakeFCToEarnCFX: string;
        titleSignToEarnAPY: string;
        titleWithdrawCapital: string;
        titleSignToSyncInterest: string;
        buttonWithdrawInterest: string;
        buttonWithdraw: string;
        buttonAnnounce: string;
        buttonSign: string;
        buttonStake: string;
        availableBalance: string;
        availableToSign: string;
        max: string;
        notice: {
            title: string;
            items: {
                first: string;
                second: string;
                third: string;
                fourth: string;
                fifth: string;
            };
            confirm: string;
        };
        tip: {
            myNFT: string;
            unsignedFC: string;
            legacyProfit: string;
            beforeWithdraw: string;
            withdrawTitle: string;
            exchangeTitle: string;
            signed: string;
            unsigned: string;
            APY: string;
            beforeWithdrawInModal: string;
            beforeExchangeInModal: string;
            required: string;
        };
        buttonCancel: string;
        buttonOk: string;
    };
    contract: {
        status: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
        };
        thisContract: string;
        address: string;
        nameTag: string;
        registered: string;
        site: string;
        tokenSite: string;
        gateway: string;
        gatewayListTip: string;
        contractIcon: string;
        remove: string;
        tokenTracker: string;
        tokenIcon: string;
        sourceCode: string;
        abi: string;
        constructorArgs: string;
        constructorArgsTips: string;
        libraryContracts: string;
        encodedView: string;
        decodedView: string;
        enterPassword: string;
        contractAdmin: string;
        creator: string;
        storageSponsor: string;
        gasSponsor: string;
        create: {
            title: string;
        };
        edit: {
            title: string;
        };
        updateContract: string;
        updateToken: string;
        verify: {
            contractCodeVerified: string;
            contractName: string;
            optimizationEnabled: string;
            otherSettings: string;
            evmVersion: string;
            license: string;
            compilerVersion: string;
            runs: string;
            tipLeft: string;
            tipCenter: string;
            tipRight: string;
            isVerifiedTip: string;
        };
        code: string;
        sourceCodeShort: string;
        sourceCodeFilename: string;
        abiShort: string;
        maxSize: string;
        supportType: string;
        namePlaceholder: string;
        requiredAddress: string;
        requiredNameTag: string;
        sitePlaceholder: string;
        invalidContractAddress: string;
        invalidNameTag: string;
        duplicatedNameTag: string;
        invalidUrl: string;
        errorNotAdmin: string;
        invalidIconSize: string;
        invalidIconType: string;
        errorTokenICon: string;
        beforeContractSubmitTip: string;
        invalidJsonAbi: string;
        abiNotUploaded: string;
        abiError: string;
        readContract: string;
        writeContract: string;
        readAsProxyContract: string;
        writeAsProxyContract: string;
        readContractInformation: string;
        writeContractInformation: string;
        noReadContract: string;
        noWriteContract: string;
        notVerifyImplementContract: string;
        pattern: string;
        expandAll: string;
        reset: string;
        payableAmountCfx: string;
        error: {
            address: string;
            bool: string;
            int: string;
            uint: string;
            bytes: string;
            bytesM: string;
            cfx: string;
            array: string;
            tuple: string;
            tupleArray: string;
            notSupport: string;
            testnet: string;
            mainnet: string;
        };
        tupleFormat: string;
        tupleTips: string;
        query: string;
        write: string;
        viewTx: string;
        collapseAll: string;
    };
    contractDeployment: {
        title: string;
        description: string;
        tip: string;
        notice: {
            first: string;
            second: string;
            third: string;
        };
    };
    contractVerification: {
        title: string;
        description: string;
        tip: string;
        notice: {
            first: string;
            second: string;
            third: string;
            fourth: string;
        };
        upload: string;
        submit: string;
        contractAddress: string;
        runs: string;
        contractName: string;
        compiler: string;
        optimization: string;
        license: string;
        evmVersion: string;
        contractLibraryAddress: string;
        contractLibraryAddressTip: string;
        libraryName: string;
        libraryContractAddress: string;
        contractSourceCode: string;
        error: {
            required: string;
            min: string;
            isNotAddress: string;
            isNotMainnet: string;
            isNotTestnet: string;
            pleaseSelect: string;
            pleaseEnter: string;
            notMatch: string;
        };
        OptimizationOption: {
            yes: string;
            no: string;
        };
        placeholder: {
            contractAddress: string;
            runs: string;
            contractName: string;
            compiler: string;
            optimization: string;
            license: string;
            contractSourceCode: string;
        };
        status: {
            loading: string;
            success: string;
            error: string;
        };
    };
    contractDetail: {
        title: string;
        content: string;
        contractAdminWarning: string;
        at: string;
        txOnlyEn: string;
        txOnlyZh: string;
        clickToApply: string;
        clickToReport: string;
        notDeployed: string;
    };
    addressDetail: {
        minedBlocks: string;
        NFTAsset: string;
        title: string;
        content: string;
        staked: string;
        stakingEarned: string;
        locked: string;
        unlockTime: string;
        currentVotingRights: string;
        apy: string;
        lockedDetailTitle: string;
        lockedDetailLocked: string;
        lockedDetailUnlockBlockNumber: string;
        lockedDetailUnlockTime: string;
        viewLockedDetails: string;
        pos: {
            identifier: string;
            totalStakedRights: string;
            totalInterests: string;
            unlockRights: string;
            lockedRights: string;
        };
    };
    blocks: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        latestBlocks: string;
    };
    transactions: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        latestTransactions: string;
        pending: string;
        executed: string;
        pendingTxnGasFee: string;
        executedTotal: string;
        pendingTotal: string;
        pendingTotalLt10: string;
        pendingTip: string;
        pendingReasonTip: string;
        viewTxn: string;
    };
    cfxTransfers: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    tokens: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        dataSource: string;
        crcTip: string;
        table: {
            number: string;
            token: string;
            transfer: string;
            totalSupply: string;
            holders: string;
            price: string;
            change: string;
            volume: string;
            marketCap: string;
            contract: string;
        };
    };
    accounts: {
        title: string;
        description: string;
        tipLeft: string;
        tipRight: string;
        totalBalance: string;
        stakingBalance: string;
        balance: string;
        sortButtonBefore: string;
        sortButtonAfter: string;
        table: {
            number: string;
            address: string;
            balance: string;
            percentage: string;
            count: string;
        };
        downloadButtonText: string;
    };
    contracts: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    registeredContracts: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
    };
    header: {
        cns: string;
        approval: string;
        home: string;
        bnt: string;
        block: string;
        txn: string;
        cfxTransfers: string;
        blockchain: string;
        accounts: string;
        tokens: string;
        tokens20: string;
        tokens721: string;
        tokens1155: string;
        contract: string;
        contractCreation: string;
        contractSponsor: string;
        contractDeployment: string;
        contractVerification: string;
        contracts: string;
        chartsAndStatistics: string;
        ecosystem: string;
        stakingAndGovernance: string;
        developerAPI: string;
        fcCfx: string;
        crossSpace: string;
        more: string;
        tools: string;
        balanceChecker: string;
        charts: string;
        posCharts: string;
        nftCharts: string;
        crossSpaceCharts: string;
        statistics: string;
        support: string;
        faq: string;
        feedback: string;
        techIssue: string;
        report: string;
        supportCenter: string;
        suggestionBox: string;
        testnet: string;
        oceanus: string;
        searchPlaceHolder: string;
        searchPlaceHolderMobile: string;
        searchPlaceHolderWithWeb3: string;
        searchPlaceHolderMobileWithWeb3: string;
        addressConverter: string;
        faucet: string;
        broadcastTx: string;
        blocknumberCalc: string;
        nftChecker: string;
        nftDetail: string;
        notice: string;
        search: {
            ens: string;
            tokens: string;
            contracts: string;
            contractsTip: string;
            nametag: string;
        };
        pos: {
            posNickname: string;
            pos: string;
            overview: string;
            accounts: string;
            blocks: string;
            transactions: string;
            committee: string;
            incomingRank: string;
        };
        profile: string;
    };
    footer: {
        currency: {
            usd: string;
            cny: string;
            gbp: string;
            krw: string;
            rub: string;
            eur: string;
        };
        aboutUs: {
            title: string;
            supportCenter: string;
            privacyPolicy: string;
            terms: string;
        };
        cookie: string;
        addressWarning: string;
        cookieAgree: string;
        product: string;
        confluxnetwork: string;
        fluentwallet: string;
        confluxbounty: string;
        hub: string;
        global: string;
        copryRight: string;
        tool: string;
        addressFormatConversion: string;
        broadcastTx: string;
        blocknumberCalc: string;
        preference: string;
        contactUs: string;
        techIssue: string;
        report: string;
        suggestionBox: string;
        developResource: {
            title: string;
            developerDocuments: string;
            developerAPI: string;
            confluxStudio: string;
            confluxTruffle: string;
        };
    };
    packing: {
        title: string;
        btn: string;
    };
    notFound: {
        title: string;
        label: string;
        addressTip: string;
        btn: string;
    };
    notFoundAddress: {
        title: string;
        label: string;
        btn: string;
        defaultType: string;
        contract: string;
        block: string;
        transaction: string;
    };
    networkError: {
        title: string;
        label: string;
        btn: string;
    };
    token: {
        website: string;
        token: string;
        totalSupplay: string;
        contract: string;
        holders: string;
        decimals: string;
        transfers: string;
        analysis: string;
        price: string;
        change: string;
        volume: string;
        marketCap: string;
        shuttleflow: string;
        fcMining: string;
        notRegistered: string;
        tokenRegistration: string;
        transferList: {
            searchError: string;
            balance: string;
        };
        NFT: string;
        total: string;
        tokens: string;
        sortBy: string;
        recentlyActive: string;
        newest: string;
        oldest: string;
    };
    highcharts: {
        subtitle: string;
        nft: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                assets: string;
                holders: string;
                contracts: string;
                transfers: string;
            };
            assets: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            holders: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            contracts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            transfers: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
        };
        crossSpace: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                "daily-cfx-transfer": string;
                "daily-cfx-transfer-count": string;
                contract: string;
            };
            dailyCFXTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            dailyCFXTransferCount: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
        };
        pos: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
            };
            breadcrumb: {
                charts: string;
                "finalized-interval": string;
                "daily-accounts": string;
                "daily-staking": string;
                "daily-apy": string;
                "total-reward": string;
                "daily-reward-rank": string;
                "daily-reward-info": string;
                "daily-deposit": string;
                "participation-rate": string;
            };
            finalizedInterval: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            dailyAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            dailyStaking: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            apy: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            totalReward: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            dailyRewardRank: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                PoSAddress: string;
                PoWAddress: string;
                reward: string;
            };
            dailyRewardInfo: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            dailyDeposit: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            participation: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
        };
        pow: {
            preview: {
                title: string;
                subtitle: string;
                viewDetail: string;
                tip: string;
                marketData: string;
                blockchainData: string;
                transaction: string;
                account: string;
                contracts: string;
            };
            breadcrumb: {
                charts: string;
                blocktime: string;
                tps: string;
                hashrate: string;
                difficulty: string;
                supply: string;
                circulating: string;
                tx: string;
                "token-transfer": string;
                "cfx-transfer": string;
                "cfx-holder-accounts": string;
                "account-growth": string;
                "active-accounts": string;
                contracts: string;
            };
            averageBlockTime: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            tps: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            hashRate: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            difficulty: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            totalSupply: {
                title: string;
                subtitle: string;
                fourYearUnlock: string;
                twoYearUnlock: string;
                circulatingSupply: string;
                zeroAddress: string;
            };
            circulatingSupply: {
                title: string;
                subtitle: string;
                others: string;
                totalCollateral: string;
                totalStaking: string;
            };
            tx: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            cfxTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            tokenTransfer: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            CFXHolderAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            accountGrowth: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            activeAccounts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
            };
            contracts: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
            };
            contract: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
            };
            token: {
                title: string;
                subtitle: string;
                yAxisTitle: string;
                seriesName: string;
                yAxisTitle2: string;
                seriesName2: string;
                yAxisTitle3: string;
                seriesName3: string;
                yAxisTitle4: string;
                seriesName4: string;
            };
        };
        options: {
            time: string;
            range: string;
        };
    };
    charts: {
        title: string;
        subtitle1: string;
        subtitle2: string;
        subtitle3: string;
        subtitle4: string;
        subtitle5: string;
        description: string;
        tps: {
            title: string;
            description: string;
        };
        tokenTransferTps: {
            title: string;
            description: string;
        };
        blockTime: {
            title: string;
            description: string;
        };
        difficulty: {
            title: string;
            description: string;
        };
        hashRate: {
            title: string;
            description: string;
        };
        cfxPrice: {
            title: string;
            description: string;
        };
        cfxMarketCap: {
            title: string;
            description: string;
        };
        issued: {
            title: string;
            description: string;
            labelFourYearUnlockBalance: string;
            labelTwoYearUnlockBalance: string;
            labelTotalCirculating: string;
        };
        zeroAddress: {
            title: string;
            description: string;
        };
        dailyTransaction: {
            title: string;
            description: string;
        };
        dailyTransactionCFX: {
            title: string;
            description: string;
            amount: string;
            txnCount: string;
            userCount: string;
        };
        dailyTransactionTokens: {
            title: string;
            description: string;
            txnCount: string;
            userCount: string;
        };
        cfxHoldingAccounts: {
            title: string;
            description: string;
        };
        activeAccounts: {
            title: string;
            description: string;
        };
        accountGrowth: {
            title: string;
            description: string;
        };
        contractGrowth: {
            title: string;
            description: string;
        };
        contractAmount: {
            title: string;
            description: string;
        };
        contractDeploy: {
            title: string;
            description: string;
            contractCount: string;
            contractTotalCount: string;
        };
        tokenAnalysis: {
            title: string;
            description: string;
            transferAmount: string;
            transferCount: string;
            uniqueReceiver: string;
            uniqueSender: string;
        };
        contractAnalysis: {
            title: string;
            description: string;
            tx: string;
            cfxTransfer: string;
            tokenTransfer: string;
        };
    };
    general: {
        fold: string;
        expand: string;
        refresh: string;
        timestamp: string;
        create: string;
        edit: string;
        delete: string;
        buttonCancel: string;
        buttonOk: string;
        warning: string;
        deleteTip: string;
        exceedTip: string;
        networks: {
            mainnet: string;
            testnet: string;
            privatenet: string;
        };
        errors: {
            address: string;
        };
        advancedSearch: {
            label: {
                txnHash: string;
                blockHash: string;
                fromOrTo: string;
                address: string;
                from: string;
                to: string;
                tokenId: string;
                nonce: string;
                token: string;
                tokenSubTitle: string;
                rangePicker: string;
                epochNumber: string;
                minEpochNumber: string;
                maxEpochNumber: string;
            };
            error: {
                invalidHash: string;
                invalidAddress: string;
            };
            placeholder: {
                pleaseSelect: string;
                pleaseEnter: string;
                pleaseEnterTxnHash: string;
                pleaseEnterBlockHash: string;
                pleaseEnterTokenId: string;
                pleaseEnterNonce: string;
                pleaseEnterEpochStart: string;
                pleaseEnterEpochEnd: string;
            };
            button: {
                lookup: string;
                reset: string;
            };
            others: {
                recommend: string;
                recommendTip: string;
                searchResult: string;
                noData: string;
            };
        };
        tokenTypeTag: {
            token: string;
        };
        searchInputPlaceholder: {
            txnHash: string;
            address: string;
            holderAddress: string;
            tokenID: string;
            blockHash: string;
            epoch: string;
        };
        totalRecord: string;
        totalRecordWithLimit: string;
        totalRecordWithType: string;
        totalRecordWithLimitWithType: string;
        totalHolders: string;
        totalRecordLimit: string;
        remark: string;
        invalidBytecode: string;
        invalidABI: string;
        invalidJsonFile: string;
        importJsonFile: string;
        showLess: string;
        viewMore: string;
        viewAll: string;
        viewAllBlocks: string;
        viewAllTxns: string;
        viewAllPosAccounts: string;
        viewAllPosCommittees: string;
        back: string;
        address: {
            editContract: string;
            website: string;
            address: string;
            more: {
                title: string;
                report: string;
                editContract: string;
                editToken: string;
                sponsor: string;
                website: string;
                balanceChecker: string;
                verifyContract: string;
                NFTChecker: string;
                addLabel: string;
                updateLabel: string;
            };
        };
        loading: string;
        contract: string;
        verifiedContract: string;
        unverifiedContract: string;
        internalContract: string;
        specialAddress: string;
        zeroAddress: string;
        invalidAddress: string;
        eSpaceAddress: string;
        invalidPosAddress: string;
        invalidAddressWarning: string;
        balance: string;
        token: string;
        abnormalToken: string;
        storageStaking: string;
        nonce: string;
        transaction: string;
        transactions: string;
        tokenTxns: string;
        cfxTransfer: string;
        tokenTxnsErc20: string;
        tokenTxnsErc721: string;
        tokenTxnsErc1155: string;
        table: {
            noData: string;
            whoops: string;
            dateTime: string;
            switchAgeTip: string;
            block: {
                epoch: string;
                position: string;
                txns: string;
                hash: string;
                miner: string;
                avgGasPrice: string;
                gasUsedPercent: string;
                reward: string;
                age: string;
                difficulty: string;
                gasLimit: string;
            };
            transaction: {
                hash: string;
                method: string;
                from: string;
                to: string;
                value: string;
                gasPrice: string;
                gasFee: string;
                age: string;
                pendingReason: string;
            };
            token: {
                number: string;
                token: string;
                price: string;
                change: string;
                volume: string;
                marketCap: string;
                transfer: string;
                totalSupply: string;
                holders: string;
                contract: string;
                txnHash: string;
                age: string;
                from: string;
                fromType: string;
                fromTypeIn: string;
                fromTypeOut: string;
                fromTypeArrow: string;
                to: string;
                accountAddress: string;
                tokenId: string;
                details: string;
                view: string;
                quantity: string;
                erc1155QuantityTip: string;
                percentage: string;
                traceType: string;
                traceOutcome: string;
                traceResult: string;
                traceStatusTitle: string;
                traceStatus: {
                    success: string;
                    fail: string;
                    revert: string;
                };
                projectInfo: {
                    projectInfo: string;
                    security: string;
                    verify: string;
                    unverify: string;
                    audit: string;
                    sponsor: string;
                    zeroAddress: string;
                    notZeroAddress: string;
                    listedByCentralized: string;
                    listedByDecentralized: string;
                    listedByCMC: string;
                    blackList: string;
                    modal: {
                        security: string;
                        verify: string;
                        unverify: string;
                        unaudit: string;
                        audit: string;
                        sponsor: string;
                        zeroAddress: string;
                        notZeroAddress: string;
                        uncex: string;
                        cex: string;
                        binance: string;
                        huoBi: string;
                        ok: string;
                        undex: string;
                        dex: string;
                        uncmc: string;
                        cmc: string;
                        remarkTitle: string;
                        remarkContent1: string;
                        remarkContent2: string;
                        remarkContent3: string;
                        remarkContent4: string;
                        disclaimer: string;
                    };
                };
            };
            contracts: {
                number: string;
                name: string;
                address: string;
                transactionCount: string;
            };
        };
        pagination: {
            labelPageSizeBefore: string;
            labelPageSizeAfter: string;
            labelJumperBefore: string;
            labelJumperAfter: string;
        };
        copyButton: {
            copyToClipboard: string;
            success: string;
            failed: string;
        };
        submit: string;
        apply: string;
        search: string;
        qrcodeButton: {
            clickToShow: string;
            contract: string;
            address: string;
            scanQRCode: string;
        };
        notAvailable: string;
        noResult: string;
        security: {
            notAvailable: string;
            finalized: string;
            high: string;
            medium: string;
            low: string;
            veryLow: string;
        };
        status: {
            skip: {
                text: string;
                explanation: string;
            };
            error: {
                text: string;
                explanation: string;
            };
            success: {
                text: string;
                explanation: string;
            };
            unexecuted: {
                text: string;
                explanation: string;
            };
            pending: {
                text: string;
                explanation: string;
            };
        };
        countdown: {
            year: string;
            year_plural: string;
            month: string;
            month_plural: string;
            day: string;
            day_plural: string;
            hour: string;
            hour_plural: string;
            minute: string;
            minute_plural: string;
            second: string;
            second_plural: string;
            ago: string;
        };
        startDate: string;
        endDate: string;
        submitSucceed: string;
        tabLabel: {
            lt10000: string;
            gte10000: string;
        };
        errorOccurred: string;
        error: {
            title: string;
            detail: string;
            description: {
                "20000": string;
                "20001": string;
                "20002": string;
                "20003": string;
                "20004": string;
                "30001": string;
                "50001": string;
                "50100": string;
                "50101": string;
                "50102": string;
                "50103": string;
                "50104": string;
                "50105": string;
                "50200": string;
                "50201": string;
                "50202": string;
                "50300": string;
                "50301": string;
                "50302": string;
                "50303": string;
                "50400": string;
                "50401": string;
                "50500": string;
                "50501": string;
                "50600": string;
                "50601": string;
                "50602": string;
                "50603": string;
                "50604": string;
                "50605": string;
                "50700": string;
                "50701": string;
                "50702": string;
                "50703": string;
                "50704": string;
                "60002": string;
                "400": string;
                "401": string;
                "403": string;
                "404": string;
                "405": string;
                "500": string;
                "501": string;
                "502": string;
                "503": string;
                "504": string;
            };
        };
        connnectWalletSubmit: string;
        waitForConfirm: string;
        txRejected: string;
        exportRecords: string;
        downloadCSV: {
            latest5000records: string;
            download: string;
            csvFile: string;
        };
        preview: string;
        yes: string;
        no: string;
    };
    sponsor: {
        title: string;
        storageSponsor: string;
        gasFeeSponsor: string;
        currentAvialStorageFee: string;
        currentAvialStorageQuota: string;
        currentAvialGasFee: string;
        providedStorage: string;
        providedGas: string;
        availStorage: string;
        availGas: string;
        connectToApply: string;
        notice: string;
        noticeFirst: string;
        noticeSecond: string;
        noticeThird: string;
        errReachToMax: string;
        errInsufficientFee: string;
        errReplaceThird: string;
        errContractNotFound: string;
        errCannotReplaced: string;
        errUpgraded: string;
        upperBound: string;
        submitted: string;
        txHash: string;
        searchAddress: string;
        applicationUnit: string;
        tx: string;
        byFoundation: string;
        storage: {
            used: string;
            quota: string;
            point: string;
            collateral: string;
            example: string;
            desc: string;
        };
    };
    transaction: {
        note: string;
        addNote: string;
        updateNote: string;
        pendingReasonLink: string;
        tipOfTokenTransferCount: string;
        gotoDetail: string;
        inThePosition: string;
        overview: string;
        viewOutgoingTxns: string;
        viewIncomingTxns: string;
        viewFailedTxns: string;
        viewCreationTxns: string;
        title: string;
        description: string;
        hash: string;
        executedEpoch: string;
        proposedEpoch: string;
        timestamp: string;
        status: string;
        from: string;
        to: string;
        tokenTransferred: string;
        value: string;
        gasUsed: string;
        gasPrice: string;
        gasFee: string;
        gasCharged: string;
        nonce: string;
        blockHash: string;
        position: string;
        storageLimit: string;
        storageCollateralized: string;
        storageReleased: string;
        chainID: string;
        inputData: string;
        select: {
            decodeInputData: string;
            original: string;
            utf8: string;
            json: string;
            generalDecode: string;
            optimizationDecode: string;
        };
        contract: string;
        created: string;
        contractCreation: string;
        for: string;
        tokenId: string;
        inputTips: string;
        epochConfirmations: string;
        statusError: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
        };
        internalTxns: {
            title: string;
            simple: string;
            advanced: string;
        };
        internalTxnsTip: {
            from: string;
            to: string;
            produced: string;
            txns: string;
            tip: string;
        };
        logs: {
            title: string;
            address: string;
            name: string;
            topics: string;
            data: string;
            decode: string;
            hex: string;
            text: string;
            number: string;
        };
        pending: {
            view: string;
            detail: string;
            tip: string;
            reference: string;
            link: string;
        };
        pendingDetails: {
            futrueNonce: {
                summary: string;
                detail: string;
                tip: string;
            };
            notEnoughCash: {
                summary: string;
                contractCreateAndToEOA: {
                    detail: string;
                    tip: string;
                };
                toContract: {
                    detail: string;
                    tip: string;
                    reason: {
                        notSponsored: string;
                        exceedUpperBound: string;
                        exceedGasFeeBalance: string;
                        exceedStorageFeeBalance: string;
                    };
                };
                original: {
                    detail: string;
                    tip: string;
                };
            };
            readyToPack: {
                summary: string;
                epochExceed: {
                    detail: string;
                    tip: string;
                };
                lowGasPrice: {
                    detail: string;
                    tip: string;
                };
            };
            tooOldEpoch: {
                summary: string;
                detail: string;
                tip: string;
            };
            fullnodeInnerError: {
                summary: string;
                detail: string;
                tip: string;
            };
        };
        action: {
            title: string;
            tooltip: string;
        };
    };
    block: {
        overview: string;
        title: string;
        description: string;
        blockHeight: string;
        epoch: string;
        difficulty: string;
        miner: string;
        reward: string;
        security: string;
        blame: string;
        blockHash: string;
        posBlockHash: string;
        parentHash: string;
        nonce: string;
        gasUsed: string;
        timestamp: string;
        size: string;
        transactions: string;
        referenceBlocks: string;
        tabs: {
            transactions: string;
            referenceBlocks: string;
            labelCountBefore: string;
            labelCountAfter: string;
        };
    };
    epoch: {
        title: string;
        description: string;
        tipCountBefore: string;
        tipCountAfter: string;
        labelCountBefore: string;
        labelCountAfter: string;
        blocks: string;
        transactions: string;
        table: {
            position: string;
            hash: string;
            txns: string;
            miner: string;
            difficulty: string;
            gasUsedPercent: string;
            age: string;
        };
    };
    addressConverter: {
        title: string;
        subtitle: string;
        button: string;
        inputPlaceholder: string;
        networkId: string;
        incorrectFormat: string;
        lowercase: string;
        checksum: string;
        newMainnetAddress: string;
        newTestnetAddress: string;
        newCustomnetAddress: string;
        remark: string;
        tip1: string;
        tip2: string;
        tip3: string;
        tip3Link: string;
        tip3end: string;
        tip5: string;
        tip5Link: string;
        tip5Middle: string;
        tip5end: string;
        tip4: string;
        errorMessage: {
            "0x0": string;
            "0x8": string;
            notSupport: string;
        };
        warning: string;
        warnings: {
            one: string;
            two: string;
            three: string;
            four: string;
        };
    };
    broadcastTx: {
        title: string;
        subtitle: string;
        broadcastBtn: string;
        success: string;
        error: string;
        unknownError: string;
    };
    blocknumberCalc: {
        title: string;
        placeholder: string;
        higherError: string;
        calcBtn: string;
        currentBlocknumber: string;
        remainingBlocks: string;
        targetDate: string;
        day: string;
        hour: string;
        min: string;
        sec: string;
    };
    notice: {
        mainnet: string[];
        testnet: string[];
        link: string;
        testnetLink: string;
    };
    toolTip: {
        block: {
            blockHeight: string;
            epoch: string;
            difficulty: string;
            miner: string;
            reward: string;
            security: string;
            blame: string;
            blockHash: string;
            posBlockHash: string;
            parentHash: string;
            nonce: string;
            gasUsedLimit: string;
            timestamp: string;
            size: string;
            transactions: string;
            referenceBlocks: string;
        };
        tx: {
            transactionHash: string;
            executedEpoch: string;
            proposedEpoch: string;
            timestamp: string;
            status: string;
            security: string;
            from: string;
            to: string;
            tokenTransferred: string;
            value: string;
            gasUsedLimit: string;
            gasPrice: string;
            gasFee: string;
            gasCharged: string;
            gasLimitTip: string;
            gasUsedTip: string;
            gasChargedip: string;
            nonce: string;
            blockHash: string;
            position: string;
            storageLimit: string;
            storageCollateralized: string;
            storageReleased: string;
            chainID: string;
            inputData: string;
        };
        address: {
            balance: string;
            token: string;
            storageCollateral: string;
            nonce: string;
            stakedBegin: string;
            stakedEnd: string;
            stakingEarned: string;
            lockedBegin: string;
            lockedEnd: string;
            currentVotingRights: string;
        };
        token: {
            price: string;
            volume: string;
            marketCap: string;
            fullyDilutedMarketCap: string;
            totalSupply: string;
            holders: string;
            transfers: string;
            contract: string;
            decimals: string;
        };
        contract: {
            balance: string;
            token: string;
            storageCollateral: string;
            nameTag: string;
            tokenTracker: string;
            contractCreator: string;
            contractAdmin: string;
            storageSponsor: string;
            gasFeeSponsor: string;
        };
    };
    connectWallet: {
        button: {
            connectWallet: string;
            nPending: string;
            wrongNetwork: string;
            switchNetwork: string;
        };
        modal: {
            title: string;
            installFluentWallet: string;
            fluentWallet: string;
            initializing: string;
            errorConnecting: string;
            tryAgain: string;
            newToConflux: string;
            learnMore: string;
            account: string;
            connectedWithFluentWallet: string;
            copyAddress: string;
            viewOnConfluxScan: string;
            networkNotice: string;
            addressNotice: string;
            switchToMainnet: string;
            switchToTestnet: string;
            switchToScanNetwork: string;
            cannotProcess: string;
            upgradeTipAddress: string;
        };
        history: {
            emptyRecordsTip: string;
            recentlyRecordsTip: string;
            clearAll: string;
            recentlyTenRecordsTip: string;
            contractCreation: string;
            contractEdit: string;
            sponsorApplication: string;
            writeContract: string;
            viewYourtransaction: string;
        };
        notify: {
            link: string;
            action: {
                "100": string;
                "101": string;
                "102": string;
                "103": string;
                "104": string;
                "105": string;
                "106": string;
                "107": string;
                "108": string;
                "109": string;
                "110": string;
                "111": string;
                "112": string;
                "113": string;
                "114": string;
                "115": string;
            };
        };
        tip: string;
    };
    statistics: {
        statistics: string;
        overview: string;
        transactions: string;
        tokens: string;
        miners: string;
        network: string;
        overviewTransactions: string;
        overviewTokens: string;
        overviewMiners: string;
        overviewNetwork: string;
        overviewMore: string;
        topTxnCountSent: string;
        topTxnCountReceived: string;
        topCFXSend: string;
        topCFXReceived: string;
        topTokensBySenders: string;
        topTokensByReceivers: string;
        topTokensByTxnCount: string;
        topTokensByTxnAccountsCount: string;
        topMinersByBlocksMined: string;
        topAccountsByGasUsed: string;
        topAccountsByTxnCount: string;
        valueInTotal: string;
        txnCountInTotal: string;
        span: {
            "24h": string;
            "3d": string;
            "7d": string;
        };
        overviewColumns: {
            totalCFXSent: string;
            totalCFXReceived: string;
            totalTxnCount: string;
            totalTxnCountSent: string;
            totalTxnCountReceived: string;
            totalTokenSent: string;
            totalTokenReceived: string;
            totalTokenTransfersCount: string;
            totalTokenTransfersAccountsCount: string;
            totalMiners: string;
            highestNodes: string;
            totalBlocksMined: string;
            totalGasUsed: string;
            top10: string;
        };
        column: {
            rank: string;
            address: string;
            txn: string;
            txnValue: string;
            txnAccounts: string;
            percentage: string;
            token: string;
            senders: string;
            receivers: string;
            totalBlocksMined: string;
            totalRewards: string;
            totalTxnFees: string;
            hashRate: string;
            gasUsed: string;
        };
        home: {
            currentBlockNumber: string;
            currentEpoch: string;
            account: string;
            transactions: string;
            contract: string;
            minerCount: string;
            gasUsed: string;
        };
        pos: {
            finalizedEpoch: string;
            currentBlockNumber: string;
            totalLocked: string;
            totalInterest: string;
            lastInterestDistributionDate: string;
            lastInterestDistributionEpoch: string;
            totalAccountCount: string;
            votingBlock: string;
            apy: string;
            apyTip: string;
        };
    };
    swap: {
        swap: string;
        from: string;
        to: string;
        balance: string;
        availableBalance: string;
        availableBalanceTip: string;
        connectWallet: string;
        enterAmount: string;
        insufficientBalance: string;
        max: string;
        selectAToken: string;
        cfx: string;
        wcfx: string;
        swapNCFXToNWCFX: string;
        swapNWCFXToNCFX: string;
    };
    report: {
        title: string;
        subtitle: string;
        address: string;
        txnHash: string;
        selectType: string;
        phishHack: string;
        scam: string;
        fishy: string;
        highRisk: string;
        spam: string;
        others: string;
        description: string;
        tip: string;
        nCharacters: string;
        code: string;
        submit: string;
        error: {
            addressRequired: string;
            addressInvalid: string;
            typeRequired: string;
            descriptionRequired: string;
            recaptchaRequired: string;
            txnHashInvalid: string;
            isNotMainnet: string;
            isNotTestnet: string;
        };
        status: {
            success: string;
            fail: string;
        };
    };
    balanceChecker: {
        tokenBalanceChecker: string;
        balanceChecker: string;
        subtitle: string;
        tokenQuantity: string;
        tokenSupply: string;
        cfxBalance: string;
        address: string;
        contractAddress: string;
        epochNoOrDate: string;
        or: string;
        chooseDate: string;
        enterEpochNo: string;
        invalidEpochNo: string;
        error: string;
        lookUp: string;
        reset: string;
        tokenQuantityForAccountAddress: string;
        totalSupplyForContractAddress: string;
        cfxBalanceForAddress: string;
        snapshotDate: string;
        epoch: string;
        epochNo: string;
    };
    approval: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        txHash: string;
        token: string;
        tokenType: string;
        amount: string;
        contract: string;
        operation: string;
        timestamp: string;
        revoke: string;
        view: string;
        unlimited: string;
        tips: {
            support: string;
            view: string;
            success: string;
            failed: string;
        };
        select: {
            all: string;
            ERC20: string;
            ERC721: string;
            ERC1155: string;
        };
        cns: string;
        address: string;
        resolvedAddress: string;
        expires: string;
        registrant: string;
        controller: string;
        owner: string;
        tokenid: string;
        reverseRecord: string;
        ownedCoreids: string;
        name: string;
        errors: {
            invalidAddress: string;
            cns: string;
            address: string;
            invalidText: string;
        };
    };
    cns: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        cns: string;
        resolvedAddress: string;
        expires: string;
        registrant: string;
        controller: string;
        owner: string;
        tokenid: string;
        address: string;
        reverseRecord: string;
        ownedCoreids: string;
        name: string;
        error: {
            cns: string;
            address: string;
            invalidText: string;
        };
    };
    nftChecker: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        incorrectFormat: string;
        incorrectAddressType: string;
        tokenId: string;
        plzSearch: string;
        plzSearchDesc: string;
        owner: string;
        amount: string;
    };
    pos: {
        common: {
            right: string;
            posAddress: string;
            powAddress: string;
            powBlockHash: string;
            posBlockHash: string;
            txStatus: {
                Executed: string;
                Discard: string;
                Failed: string;
            };
            txType: {
                BlockMetadata: string;
                Election: string;
                Retire: string;
                Dispute: string;
                Register: string;
                Other: string;
                UpdateVotingPower: string;
                PivotDecision: string;
            };
            txPayload: {
                vrfPublicKey: string;
                publicKey: string;
                targetTerm: string;
                vrfProof: string;
                address: string;
                votingPower: string;
                height: string;
                blockHash: string;
                blsPublicKey: string;
                conflictingVotes: string;
                conflictVoteType: string;
                proposal: string;
                vote: string;
                first: string;
                second: string;
            };
            committeeStatus: {
                electionInProgress: string;
                electionCompleted: string;
                Ongoing: string;
                termEnd: string;
            };
            votingStatus: {
                voted: string;
                committed: string;
            };
        };
        accounts: {
            title: string;
            description: string;
            address: string;
            availableVotes: string;
            currentCommitteeMember: string;
            votesInCommittee: string;
            registerDate: string;
        };
        account: {
            title: string;
            description: string;
            overview: {
                title: string;
                posAddress: string;
                lockingRights: string;
                lockedRights: string;
                unlockingRights: string;
                unlockRights: string;
                retiredBlocknumber: string;
                availableVotes: string;
                currentCommitteeMember: string;
                rightsInCommittee: string;
                unlockedVotes: string;
                totalIncoming: string;
                punishment: string;
                timestamp: string;
            };
            incomingHistory: {
                title: string;
                powBlockHash: string;
                incoming: string;
                timstamp: string;
            };
            votingHistory: {
                title: string;
                blcokHeight: string;
                blockHash: string;
                votes: string;
                timestamp: string;
            };
            votingStatus: {
                title: string;
                rights: string;
                status: string;
                in: string;
                out: string;
                blockNumberDeadline: string;
            };
        };
        blocks: {
            title: string;
            description: string;
            blockHeight: string;
            blockHash: string;
            txn: string;
            poSMinerAddress: string;
            timestamp: string;
        };
        block: {
            title: string;
            description: string;
            overview: {
                title: string;
                blockHash: string;
                blockNumber: string;
                epoch: string;
                minerAddress: string;
                timestamp: string;
                status: string;
                powBlockHash: string;
            };
            transactions: {
                title: string;
            };
            votingAddress: {
                title: string;
                votingNumber: string;
            };
        };
        transactions: {
            title: string;
            description: string;
            poSTxnHash: string;
            poSBlockHash: string;
            status: string;
            succeed: string;
            failed: string;
            discard: string;
            type: string;
            election: string;
            retire: string;
            committeeJoin: string;
            register: string;
            pivotDecision: string;
            dispute: string;
            blockMatadata: string;
            other: string;
            timstamp: string;
        };
        transaction: {
            title: string;
            description: string;
            overview: {
                title: string;
                hash: string;
                status: string;
                type: string;
                timestamp: string;
                number: string;
                blockHash: string;
                blockNumber: string;
                payload: string;
            };
        };
        committees: {
            title: string;
            description: string;
            committeeEpoch: string;
            status: string;
            numberOfMembers: string;
            totalVotes: string;
        };
        committee: {
            title: string;
            description: string;
            overview: {
                title: string;
                committeeEpoch: string;
                status: string;
                totalVotes: string;
                consensusVotes: string;
            };
            votesDistribution: {
                title: string;
                votes: string;
            };
        };
        incomingRank: {
            title: string;
            description: string;
            subTitle: string;
            totalIncoming: string;
            top100: string;
            last30days: string;
            rewardRank: {
                id: string;
                day: string;
                day_plural: string;
                all: string;
            };
        };
    };
    gaspriceDropdown: {
        blockHeight: string;
        low: string;
        median: string;
        high: string;
        market: string;
        latest60Blocks: string;
    };
};
export { ENV_LOCALES_EN, ENV_LOCALES_CN };
export declare const ENV_NETWORK_ID = 1030;
export declare const ENV_NETWORK_TYPE = NETWORK_TYPES.CORE_MAINNET;
export declare const ENV_API_HOST: string;
export declare const ENV_CORE_API_HOST: string;
export declare const ENV_CORE_SCAN_HOST: string;
export declare const ENV_RPC_SERVER: string;
export declare const ENV_WALLET_CONFIG: {
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};
export declare const ENV_OPEN_API_HOST: string;
export declare const ENV_LOGO: string;
export declare const ENV_FC_ADDRESS = "cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2";
export declare const ENV_FC_EXCHANGE_ADDRESS = "cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m";
export declare const ENV_FC_EXCHANGE_INTEREST_ADDRESS = "cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140";
export declare const ENV_CROSS_SPACE_ADDRESS = "cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv";
export declare const ENV_ENS_REGISTRY_ADDRESS = "cfx:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm";
export declare const ENV_ENS_PUBLIC_RESOLVER_ADDRESS = "cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up";
export declare const ENV_ENS_REVERSE_REGISTRAR_ADDRESS = "cfx:acfarpzehntpre0thg8x7dp0ajw4ms328ps634v1zk";
//# sourceMappingURL=mainnet.d.ts.map