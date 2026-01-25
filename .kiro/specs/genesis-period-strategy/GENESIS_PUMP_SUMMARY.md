# 🚀 Genesis Pump Strategy - Implementation Summary

## What Changed

### 1. Economic Model Shift

**From**: Balanced subsidy model (90 GD = 1 SKR withdrawal rate)  
**To**: Aggressive pump model (90% buyback & burn)

| Aspect | Old Model | Genesis Pump |
|:---|:---|:---|
| **Core Strategy** | Subsidize withdrawals | Buyback & burn GD |
| **Revenue Split** | 30% dev / 70% treasury | 10% dev / 90% buyback |
| **GD Withdrawal** | Enabled (90 GD = 1 SKR) | **Disabled** (force DEX) |
| **Output Bonus** | None | **1.2x** (20% more) |
| **Crit Rate** | 4% | **10%** (2.5x higher) |
| **Service Price** | 20/50/80 SKR | **10/25/40 SKR** (50% off) |
| **Goal** | Balanced economy | **Pump GD price 10x** |

### 2. Key Mechanisms

#### A. Automatic Buyback & Burn
```
User pays 40 SKR for auto-click
  ↓
10% (4 SKR) → Developer wallet
90% (36 SKR) → Buyback wallet
  ↓
Every hour: Buyback wallet swaps SKR for GD on Raydium
  ↓
Purchased GD sent to burn address (0x000...dead)
  ↓
GD supply decreases → Price increases 📈
```

#### B. Force DEX Trading
- Direct GD→SKR withdrawal is **disabled**
- Users must trade GD on Raydium to cash out
- Creates organic price discovery
- Builds liquidity pool
- Every trade visible on-chain

#### C. High Output + High Crit
- 1.2x output multiplier = 20% more GD earned
- 10% crit rate = More big wins
- Creates "gold rush" excitement
- Encourages more purchases

### 3. Updated Files

#### ✅ Completed
1. **requirements.md** - Complete rewrite with Genesis Pump strategy
2. **.env.local** - Updated with Genesis configuration
3. **WoodenFish.tsx** - Added discount display (strikethrough + badge)
4. **GenesisBanner.tsx** - Already created (shows countdown)

#### ⚠️ Needs Implementation
1. **Buyback automation** - Script to swap SKR→GD every hour
2. **Burn counter** - Display "Total GD Burned: X,XXX,XXX"
3. **Price chart widget** - Show GD/SKR price from Raydium
4. **Disable withdrawal** - Block or discourage GD→SKR swap
5. **Apply 1.2x multiplier** - Increase all GD rewards by 20%
6. **Increase crit rate** - Change from 4% to 10%
7. **Genesis pricing** - Use 10/25/40 instead of 20/50/80

### 4. Environment Variables

```bash
# Core Settings
VITE_GENESIS_MODE=true
VITE_GENESIS_END_TIME=1738368000  # Set to 7-14 days from launch

# Revenue Split
VITE_DEV_REVENUE_SHARE=0.10       # 10% to dev
VITE_BUYBACK_SHARE=0.90           # 90% to buyback

# Pricing (50% off)
VITE_GENESIS_MEDITATION_PRICES=10,25,40
VITE_GENESIS_MERIT_PRICES=100,250,400

# Output & Rewards
VITE_GLOBAL_OUTPUT_MULTIPLIER=1.2  # 20% bonus
VITE_GONGDE_CRIT_RATE=0.10         # 10% crit
VITE_GONGDE_MAX_REWARD=10000       # 10k max

# Withdrawal Control
VITE_ENABLE_GD_WITHDRAWAL=false    # Disable direct swap
VITE_GD_TO_SKR_RATE=200           # Or set punitive rate

# Buyback System
VITE_BUYBACK_WALLET=<address>
VITE_BURN_ADDRESS=11111111111111111111111111111111
```

## Marketing Messages

### Primary Hook
> **"每笔代敲费用的 90% 将直接用于回购 $GONGDE 并销毁！"**  
> **"90% of every purchase goes to buying & burning $GONGDE!"**

### Key Benefits
1. **50% OFF** - Meditation mode only 10/25/40 SKR
2. **1.2x Output** - Earn 20% more GD
3. **10% Crit Rate** - More big wins in Merit mode
4. **90% Buyback** - Every purchase pumps GD price
5. **Limited Time** - Prices double after Genesis

### Urgency Triggers
- "Genesis ends in X days"
- "Prices increase 100% after Genesis"
- "1.2x output bonus ends soon"
- "This discount will never return"

## Implementation Roadmap

### Phase 1: Core Features (Week 1)
- [ ] Deploy GD token contract
- [ ] Create Raydium GD/SKR pool
- [ ] Set up buyback wallet
- [ ] Implement buyback automation
- [ ] Add burn counter to homepage
- [ ] Update pricing to Genesis rates
- [ ] Apply 1.2x output multiplier
- [ ] Increase crit rate to 10%
- [ ] Disable GD withdrawal

### Phase 2: Monitoring & Marketing (Week 1-2)
- [ ] Launch Genesis campaign
- [ ] Daily burn reports
- [ ] Community engagement
- [ ] Monitor metrics dashboard
- [ ] Adjust as needed

### Phase 3: Transition to Stabilizer (Week 3)
- [ ] Announce Phase 2 (Staking)
- [ ] Develop staking contract
- [ ] Test staking UI
- [ ] Switch to Stabilizer config
- [ ] Enable GD withdrawal (120 rate)
- [ ] Launch staking pool

## Success Metrics

### Primary KPIs
1. **GD Price**: Target 5-10x increase
2. **Total Burned**: Target 10-20% of supply
3. **User Growth**: Target 1000+ users
4. **Buyback Volume**: Target 90% of revenue

### Secondary KPIs
- Conversion rate: 70%+ (high due to discount)
- ARPU: $20-50 per user
- Pool liquidity: Maintain 2:1 ratio to volume
- Slippage: Keep under 5%

## Risk Mitigation

### Price Manipulation
- Gradual buyback (spread over time)
- Slippage protection
- Monitor large trades
- Emergency pause available

### Liquidity Crisis
- Maintain minimum 50k SKR in pool
- Lock initial LP for 30 days
- Add liquidity if needed

### Regulatory
- Clear disclaimers
- Age verification
- Geo-blocking if needed
- Terms of Service

## Next Steps

1. **Review requirements.md** - Ensure all stakeholders agree
2. **Create design.md** - Technical architecture and implementation details
3. **Deploy infrastructure** - GD token, Raydium pool, buyback system
4. **Update frontend** - Apply Genesis pricing and features
5. **Test thoroughly** - All flows work correctly
6. **Launch** - Go live with Genesis campaign
7. **Monitor & adjust** - Track metrics and optimize

---

**Status**: Requirements Complete ✅  
**Next**: Create design.md with technical specifications  
**Timeline**: Ready to implement immediately after design approval
