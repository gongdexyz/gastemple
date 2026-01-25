# Genesis Period Strategy - Requirements (创世拉新版)

## 1. Overview

The Genesis Period implements a **two-phase economic model** to maximize $GONGDE (GD) growth and long-term sustainability:

### Phase 1: 🚀 Genesis Pump (创世拉新版) - Days 1-14
**Core Strategy**: Buyback & Burn - Use SKR inflow to pump GD price
**Goal**: Create explosive GD price chart to attract SKR community attention
**Mechanism**: 90% of SKR revenue auto-buys GD from DEX and burns it

### Phase 2: ⚖️ Stabilizer (稳定器版) - Day 15+
**Core Strategy**: Staking & Dividends - Lock liquidity and distribute SKR rewards
**Goal**: Prevent crash, absorb bubble, establish long-term value
**Mechanism**: 50% of SKR revenue distributed to GD stakers

**Current Focus**: Phase 1 - Genesis Pump (this document)

---

## 2. Economic Model: Genesis Pump

### 2.1 Core Principle
**"SKR is mature blood, GD is your baby - use SKR's blood to nourish GD's growth"**

- **SKR Role**: Established asset with existing community and liquidity
- **GD Role**: New token that needs price discovery and community building
- **Strategy**: Every purchase creates buy pressure on GD, ensuring upward price action

### 2.2 Revenue Distribution (Pump Engine)

When players purchase auto-click services with SKR:
- **10%** → Developer wallet (operational costs)
- **90%** → **Automatic Market Making (AMM) Buy Orders**
  - System automatically buys GD from Raydium GD/SKR pool
  - Purchased GD is either burned or sent to Treasury
  - **Effect**: Every player entry = GD price goes up

### 2.3 Key Differentiators from Original Plan

| Aspect | Original Plan | Genesis Pump |
|:---|:---|:---|
| Revenue Split | 30% dev / 70% treasury | 10% dev / 90% buyback |
| GD Withdrawal | Enabled (90 GD = 1 SKR) | **Disabled** - force DEX trading |
| Output Multiplier | 1.0x | **1.2x** (20% bonus) |
| Crit Rate | 4% | **10%** (high gambling appeal) |
| Service Price | 20/50/80 SKR | **10/25/40 SKR** (50% discount) |
| Marketing Focus | Balanced economy | **"90% buyback & burn!"** |

**Duration**: 7-14 days from launch
**Target**: 1000+ users, 10x GD price increase
**Success Metric**: GD chart shows consistent upward trajectory

## 3. User Stories

### 3.1 Genesis Period Awareness
**As a** new user visiting the Gas Temple for the first time  
**I want to** see clear promotional benefits and limited-time offers  
**So that** I feel motivated to try the platform immediately

**Acceptance Criteria**:
- [x] 3.1.1 Genesis Banner is displayed prominently at the top of all pages (except landing page)
- [x] 3.1.2 Banner shows countdown timer with days, hours, and minutes remaining
- [x] 3.1.3 Banner displays key benefits: 50% OFF, 1.2x Output, 90% Buyback
- [x] 3.1.4 Banner can be dismissed by user but persists across sessions until Genesis Period ends
- [ ] 3.1.5 Banner shows real-time GD price chart (mini widget)
- [ ] 3.1.6 Banner displays "X SKR burned today" counter
- [ ] 3.1.7 Banner automatically disappears when Genesis Period ends

### 3.2 Aggressive Pricing (High Incentive)
**As a** user during Genesis Period  
**I want to** pay significantly lower prices for auto-click services  
**So that** I can achieve high ROI and feel urgency to buy before prices increase

**Acceptance Criteria**:
- [x] 3.2.1 Meditation mode prices: 10/25/40 SKR (50% off normal 20/50/80)
- [ ] 3.2.2 Merit mode prices: 100/250/400 SKR (unchanged - high risk/reward)
- [x] 3.2.3 Original price shown with strikethrough for first 3 purchases
- [x] 3.2.4 "GENESIS PRICE" or "50% OFF" badge displayed prominently
- [ ] 3.2.5 Countdown timer shows "Price increases in X days"
- [ ] 3.2.6 After Genesis Period, prices automatically revert to normal
- [ ] 3.2.7 Users who purchased during Genesis keep their active sessions at Genesis rates

### 3.3 High Output Multiplier (1.2x Bonus)
**As a** user playing during Genesis Period  
**I want to** earn 20% more GD from all activities  
**So that** I can accumulate GD faster and feel the "gold rush" excitement

**Acceptance Criteria**:
- [ ] 3.3.1 All GD rewards multiplied by 1.2x during Genesis Period
- [ ] 3.3.2 Manual clicks: 12-24 GD per click (up from 10-20)
- [ ] 3.3.3 Auto-click drops: 1.2-12 GD per drop (up from 1-10)
- [ ] 3.3.4 Merit mode rewards: 1.2x multiplier on all prizes
- [ ] 3.3.5 UI shows "🚀 1.2x GENESIS BONUS" indicator
- [ ] 3.3.6 Multiplier automatically reverts to 1.0x after Genesis Period
- [ ] 3.3.7 Announcement 24 hours before multiplier ends

### 3.4 GD Withdrawal Disabled (Force DEX Trading)
**As a** platform operator  
**I want to** disable direct GD→SKR withdrawal during Genesis Period  
**So that** users must trade GD on DEX, creating organic price discovery and liquidity

**Acceptance Criteria**:
- [ ] 3.4.1 "Exchange GD to SKR" button is disabled during Genesis Period
- [ ] 3.4.2 Tooltip explains: "Trade on Raydium for better rates! 🚀"
- [ ] 3.4.3 Link to Raydium GD/SKR pool provided
- [ ] 3.4.4 Alternative: Set extremely high withdrawal rate (e.g., 200 GD = 1 SKR) to discourage
- [ ] 3.4.5 After Genesis Period, normal withdrawal (120 GD = 1 SKR) is enabled
- [ ] 3.4.6 Clear messaging: "Genesis miners get best prices on DEX!"

### 3.5 Enhanced Merit Mode (High Crit Rate)
**As a** gambler who loves high-risk gameplay  
**I want to** experience higher crit rates in Merit mode during Genesis  
**So that** I'm more likely to hit big wins and share my success

**Acceptance Criteria**:
- [ ] 3.5.1 Base crit rate increased from 4% to 10% during Genesis Period
- [ ] 3.5.2 Epic crit multiplier increased from 5x to 10x
- [ ] 3.5.3 Max win increased from 5000 GD to 10000 GD
- [ ] 3.5.4 UI shows "🎰 GENESIS HIGH ROLLER MODE" indicator
- [ ] 3.5.5 Crit animation is more dramatic during Genesis (longer pause, bigger text)
- [ ] 3.5.6 After Genesis Period, rates revert to normal (4% base, 5x max)
- [ ] 3.5.7 Announcement 24 hours before rates change

### 3.6 Automatic Buyback & Burn System
**As a** platform operator  
**I want to** automatically use 90% of SKR revenue to buy and burn GD  
**So that** GD price consistently increases and attracts more users

**Acceptance Criteria**:
- [ ] 3.6.1 When user pays SKR for auto-click, 90% is sent to Buyback Wallet
- [ ] 3.6.2 Buyback Wallet automatically swaps SKR for GD on Raydium every 1 hour
- [ ] 3.6.3 Purchased GD is sent to burn address (0x000...dead)
- [ ] 3.6.4 Burn transactions are publicly visible on Solana Explorer
- [ ] 3.6.5 Homepage shows "🔥 Total GD Burned: X,XXX,XXX"
- [ ] 3.6.6 Homepage shows "💰 SKR Used for Buyback Today: XXX"
- [ ] 3.6.7 Admin dashboard shows buyback history and pending balance
- [ ] 3.6.8 Manual override available for emergency situations

### 3.7 Raydium Liquidity Pool Setup
**As a** platform operator  
**I want to** establish initial GD/SKR liquidity on Raydium  
**So that** users can trade GD and the buyback system can function

**Acceptance Criteria**:
- [ ] 3.7.1 Create GD/SKR pool on Raydium with initial liquidity
- [ ] 3.7.2 Initial ratio: 1 SKR = 10,000 GD (or market-determined)
- [ ] 3.7.3 Lock initial LP tokens for 30 days minimum
- [ ] 3.7.4 Pool link displayed prominently in app
- [ ] 3.7.5 Tutorial: "How to trade GD on Raydium"
- [ ] 3.7.6 Price chart widget embedded in app (TradingView or similar)
- [ ] 3.7.7 Monitor pool health and add liquidity if needed

### 3.8 Epoch Countdown & Urgency Messaging
**As a** potential user  
**I want to** see clear countdown and urgency messaging  
**So that** I understand this is a limited-time opportunity and act quickly

**Acceptance Criteria**:
- [ ] 3.8.1 Full-screen banner: "⏰ Genesis Mining ends in: 3d 12h 45m"
- [ ] 3.8.2 Warning at Day 5: "⚠️ Prices increase 100% in 2 days!"
- [ ] 3.8.3 Warning at Day 6: "⚠️ Output bonus ends in 24 hours!"
- [ ] 3.8.4 Final day: "🚨 LAST CHANCE: Genesis ends tonight!"
- [ ] 3.8.5 Auto-click purchase modal shows: "Lock in Genesis price before it doubles"
- [ ] 3.8.6 Social proof: "1,247 users joined Genesis mining today"
- [ ] 3.8.7 FOMO trigger: "Only 234 Genesis slots remaining" (if applicable)

## 4. Technical Requirements

### 4.1 Environment Variables - Genesis Pump Configuration

```bash
# ================= 🚀 GENESIS PUMP CONFIGURATION =================

# Phase Control
VITE_GENESIS_MODE=true
VITE_GENESIS_END_TIME=1738368000  # Unix timestamp (7-14 days from launch)

# Revenue Distribution
VITE_DEV_REVENUE_SHARE=0.10      # 10% to developer
VITE_BUYBACK_SHARE=0.90          # 90% to buyback & burn

# Pricing (50% discount)
VITE_GENESIS_MEDITATION_PRICES=10,25,40  # Normal: 20,50,80
VITE_GENESIS_MERIT_PRICES=100,250,400    # Unchanged

# Output Multiplier
VITE_GLOBAL_OUTPUT_MULTIPLIER=1.2  # 20% bonus

# Merit Mode (High Gambling Appeal)
VITE_GONGDE_CRIT_RATE=0.10         # 10% crit rate (up from 4%)
VITE_GONGDE_BIG_WIN_MULTIPLIER=10  # 10x max (up from 5x)
VITE_GONGDE_MAX_REWARD=10000       # 10k GD max (up from 5k)

# Withdrawal Control
VITE_ENABLE_GD_WITHDRAWAL=false    # Disable direct GD→SKR swap
# OR set punitive rate:
VITE_GD_TO_SKR_RATE=200           # 200 GD = 1 SKR (discourage withdrawal)

# Buyback System
VITE_BUYBACK_WALLET=<wallet_address>
VITE_BUYBACK_INTERVAL=3600000     # 1 hour in milliseconds
VITE_BURN_ADDRESS=11111111111111111111111111111111  # Solana burn address

# Raydium Pool
VITE_RAYDIUM_POOL_ADDRESS=<pool_address>
VITE_GD_SKR_INITIAL_RATIO=10000   # 1 SKR = 10,000 GD
```

### 4.2 Smart Contract / Backend Requirements
**Buyback Automation**:
- Cron job or smart contract that runs every hour
- Checks Buyback Wallet balance
- If balance > threshold (e.g., 10 SKR):
  - Swap SKR for GD on Raydium
  - Send GD to burn address
  - Log transaction hash
  - Update "Total Burned" counter

**Revenue Splitting**:
- When user pays for auto-click:
  - 10% → Developer wallet
  - 90% → Buyback wallet
- Transaction must be atomic (both transfers succeed or fail together)

**Price Oracle**:
- Fetch GD/SKR price from Raydium pool every 5 minutes
- Display on homepage and in charts
- Cache for performance

**Data Storage**:
- Buyback history: Database table with timestamp, SKR amount, GD amount, tx hash
- Burn history: Database table with timestamp, GD amount, tx hash
- User purchase count: localStorage (per wallet)
- Genesis participation: Track which users joined during Genesis

## 5. Success Metrics

### 5.1 Price Performance (Primary KPI)
- **Target**: GD price increases 5-10x during Genesis Period
- **Metric**: (End Price - Start Price) / Start Price
- **Chart**: Must show consistent upward trajectory with minimal dumps

### 5.2 Buyback Volume
- **Target**: 90% of all SKR revenue used for buyback
- **Metric**: Buyback SKR / Total SKR revenue
- **Transparency**: All buyback transactions visible on-chain

### 5.3 GD Burn Rate
- **Target**: Burn 10-20% of total GD supply during Genesis
- **Metric**: Total GD burned / Total GD supply
- **Display**: Prominent "🔥 X,XXX,XXX GD BURNED" counter

### 5.4 User Acquisition
- **Target**: 1000+ users within 14 days
- **Metric**: Unique wallet addresses that made at least 1 purchase
- **Viral Coefficient**: Track how many users each user brings

### 5.5 Conversion Rate
- **Target**: 70%+ of visitors make at least 1 purchase (high due to low prices)
- **Metric**: Purchases / Unique visitors
- **Urgency Effect**: Track conversion rate increase as deadline approaches

### 5.6 Average Revenue Per User (ARPU)
- **Target**: $20-50 per user during Genesis
- **Metric**: Total SKR revenue / Total users
- **Upsell**: Track how many users upgrade from 1x to 3x or 5x speed

### 5.7 Liquidity Pool Health
- **Target**: Maintain 2:1 ratio of liquidity to daily volume
- **Metric**: Pool TVL / 24h volume
- **Slippage**: Keep slippage under 5% for typical trades

## 6. Marketing & Messaging

### 6.1 Primary Value Proposition

> **"每笔代敲费用的 90% 将直接用于回购 $GONGDE 并销毁！"**  
> **"90% of every purchase goes to buying & burning $GONGDE!"**
>
> **SKR 生态最强通缩代币 | The Most Deflationary Token in SKR Ecosystem**

### 6.2 Key Messages by Channel

#### Homepage Hero Section
- **Headline**: "🔥 Genesis Mining: 90% Buyback & Burn"
- **Subheadline**: "Every player entry pumps $GONGDE price. Join the gold rush."
- **CTA**: "Start Mining (50% OFF)"
- **Social Proof**: "1,247 miners active | 2.3M $GD burned today"

#### Genesis Banner
- **Day 1-3**: "⏰ Genesis ends in 11d 5h | 50% OFF + 1.2x Output"
- **Day 4-7**: "⚠️ Prices double in 7 days | Lock in Genesis rates now"
- **Day 8-12**: "🚨 FINAL DAYS | Output bonus ends soon"
- **Day 13-14**: "🔥 LAST CHANCE | Genesis ends in 24 hours"

#### Auto-Click Purchase Modal
- **Before Purchase**: "Lock in 50% discount before Genesis ends"
- **After Purchase**: "✅ Your purchase just burned X $GD! Check the chart 📈"

#### Social Media Templates
- **Twitter**: "Just burned 50,000 $GD with my mining session! 🔥 Genesis price won't last. Get in: [link]"
- **Discord**: "GM! Today's buyback: 234 SKR → 2.1M $GD burned. Chart looking spicy 🌶️"
- **Telegram**: "⚠️ Genesis Phase ends in 3 days. Prices will DOUBLE. This is your last chance for 1.2x output."

### 6.3 Urgency Triggers

#### Scarcity
- "Only 234 Genesis slots remaining" (if implementing cap)
- "First 1000 miners get lifetime 'Genesis OG' badge"

#### Price Anchoring
- "Normal price: ~~80 SKR~~ | Genesis price: **40 SKR**"
- "After Genesis: 80 SKR (100% increase)"

#### FOMO
- "1,247 users joined Genesis mining today"
- "GD price up 340% since launch"
- "Top miner earned 50,000 $GD in 24 hours"

#### Loss Aversion
- "Miss Genesis = Pay double forever"
- "1.2x output bonus ends in 3 days"
- "This discount will never return"

### 6.4 Educational Content

#### "How Genesis Works" Tutorial
1. **You pay SKR** for auto-mining service
2. **90% goes to buyback** - System buys $GD from Raydium
3. **GD gets burned** - Removed from supply forever
4. **Price goes up** - Less supply + more demand = 📈
5. **You earn more** - Your GD is worth more when you sell

#### "Why Trade on DEX?" Explainer
- **Better prices**: Market-determined rates vs. fixed rates
- **Instant liquidity**: Trade anytime, any amount
- **Price discovery**: Your trades help establish fair value
- **Transparency**: All transactions visible on-chain

#### "Genesis vs. Normal" Comparison Table

| Feature | Genesis (Now) | Normal (After) |
|:---|:---|:---|
| Service Price | 10/25/40 SKR | 20/50/80 SKR |
| Output Multiplier | 1.2x | 1.0x |
| Crit Rate | 10% | 4% |
| Buyback % | 90% | 50% |
| GD Withdrawal | Disabled | Enabled |

### 6.5 Community Engagement

#### Daily Updates
- "🔥 Daily Burn Report: X,XXX,XXX $GD burned | X SKR used for buyback"
- "📈 Price Update: $GD up X% today | New ATH!"
- "👥 Community Growth: X new miners joined today"

#### Leaderboard
- "Top 10 Genesis Miners" (by GD earned)
- "Biggest Burners" (by SKR spent)
- "Lucky Winners" (biggest crit hits)

#### Milestones
- "🎉 1M $GD Burned Milestone!"
- "🚀 1000 Miners Milestone!"
- "💎 $GD Price 10x Milestone!"

## 7. Risk Mitigation

### 7.1 Price Manipulation Prevention
- **Monitor large trades**: Alert on trades > 5% of pool liquidity
- **Gradual buyback**: Don't buy all at once, spread over time
- **Slippage protection**: Set max slippage for buyback swaps
- **Emergency pause**: Ability to pause buyback if price anomalies detected

### 7.2 Liquidity Crisis Prevention
- **Minimum liquidity**: Maintain at least 50,000 SKR in pool
- **Add liquidity**: If pool drops below threshold, add more
- **Lock LP tokens**: Initial LP locked for 30 days minimum
- **Monitor depth**: Track bid/ask spread and depth

### 7.3 Sybil Attack Prevention
- Require wallet connection for all benefits
- Track by wallet address, not browser
- Implement CAPTCHA for sensitive actions
- Rate limit purchases per wallet per day

### 7.4 Buyback System Failure
- **Backup wallet**: Secondary buyback wallet if primary fails
- **Manual override**: Admin can trigger manual buyback
- **Queue system**: If swap fails, queue for retry
- **Alert system**: Notify admin if buyback fails 3 times

### 7.5 Regulatory Compliance
- **Disclaimer**: "Not financial advice. Gambling involves risk."
- **Age verification**: Require 18+ confirmation
- **Geo-blocking**: Block restricted jurisdictions if needed
- **Terms of Service**: Clear terms about token mechanics

## 8. Post-Genesis Transition (Phase 2 Preview)

### 8.1 Epoch 2: Stabilizer Mode (⚖️ 稳定器版)

**Activation**: Day 15 (or when Genesis goals achieved)

**Key Changes**:
- **Revenue Split**: 30% dev / 20% buyback / 50% staking rewards
- **New Feature**: GD Staking Pool
  - Lock GD for 7 days
  - Earn daily SKR dividends
  - Proportional to your stake
- **Output**: Reduce to 1.0x (remove bonus)
- **Prices**: Return to normal (20/50/80 SKR)
- **Crit Rate**: Reduce to 4% (normal)
- **GD Withdrawal**: Enable at 120 GD = 1 SKR

**Marketing Shift**:
- From "Get rich quick" to "Earn passive income"
- From "FOMO" to "Sustainability"
- From "Pump" to "Dividends"

**Announcement Timeline**:
- **Day 10**: "Genesis Phase 1 ending soon. Phase 2: Staking & Dividends coming!"
- **Day 12**: "New feature preview: Stake $GD, earn SKR daily"
- **Day 14**: "Final Genesis day! Tomorrow: Staking goes live"
- **Day 15**: "🎉 Staking Pool is LIVE! Lock your $GD and start earning"

### 8.2 Smooth Transition Strategy

**Avoid Panic Selling**:
- Announce Phase 2 features early (Day 10)
- Emphasize new earning opportunities
- Grandfather existing auto-click sessions (continue at Genesis rates)
- Offer "Early Staker Bonus" for first 48 hours

**Maintain Price Support**:
- Continue 20% buyback in Phase 2
- Staking locks up supply (reduces sell pressure)
- Dividends incentivize holding

**Communication**:
- "Genesis was about growth. Stabilizer is about sustainability."
- "You pumped the price. Now earn from it."
- "From miners to stakeholders."

## 9. Implementation Roadmap

- Phantom wallet integration (completed)
- SKR token contract (completed)
- Price service (completed)
- Economic dashboard (completed, admin-only)
- Genesis Banner component (completed)

### 10.1 Completed
- ✅ Phantom wallet integration
- ✅ SKR token contract
- ✅ Price service (CoinGecko API)
- ✅ Economic dashboard (admin-only)
- ✅ Genesis Banner component
- ✅ WoodenFish component with payment flow
- ✅ Basic economic model (SKR Karma Cycle)

### 10.2 Required for Genesis Launch
- [ ] GD token contract deployed on Solana mainnet
- [ ] Raydium GD/SKR liquidity pool created
- [ ] Buyback wallet set up
- [ ] Buyback automation script (cron job or smart contract)
- [ ] Burn address configured
- [ ] Admin dashboard for monitoring buyback/burn
- [ ] "Total Burned" counter on homepage
- [ ] GD price chart widget
- [ ] Updated .env.local with Genesis config

### 10.3 Required for Phase 2 (Stabilizer)
- [ ] Staking smart contract
- [ ] Staking UI component
- [ ] Dividend distribution system
- [ ] Unstaking cooldown mechanism
- [ ] Staking rewards calculator

## 11. Out of Scope (Future Enhancements)

### 11.1 Not in Genesis Phase 1
- Referral commission system (complex, can add later)
- Free trial vouchers (not needed with 50% discount)
- Multi-tier user levels (keep simple for now)
- NFT rewards (future gamification)
- Mobile app (web-first)
- Social media integration (manual sharing for now)

### 11.2 Deferred to Phase 2 or Later
- GD staking pool (Phase 2 feature)
- Dividend distribution (Phase 2 feature)
- Advanced analytics dashboard (public)
- Governance voting with GD
- Cross-chain bridge
- Liquidity mining incentives

## 12. Acceptance Criteria Summary

### Must-Have for Launch (P0)
- [x] Genesis Banner with countdown
- [x] 50% discount pricing (10/25/40 SKR)
- [ ] 1.2x output multiplier
- [ ] 10% crit rate in Merit mode
- [ ] 90% revenue to buyback wallet
- [ ] Automatic buyback & burn every hour
- [ ] "Total Burned" counter visible
- [ ] GD withdrawal disabled or discouraged
- [ ] Raydium pool link in app

### Should-Have (P1)
- [ ] GD price chart widget
- [ ] Daily burn reports (automated)
- [ ] Admin dashboard for monitoring
- [ ] Urgency messaging (countdown warnings)
- [ ] Social proof ("X users joined today")
- [ ] Buyback transaction history

### Nice-to-Have (P2)
- [ ] Leaderboard (top miners)
- [ ] Achievement badges
- [ ] Share-to-earn features
- [ ] Advanced price charts
- [ ] Community stats dashboard

---

## 13. Final Checklist Before Launch

### Technical
- [ ] All environment variables configured
- [ ] Buyback wallet funded with initial SKR
- [ ] Raydium pool has sufficient liquidity
- [ ] Burn address verified
- [ ] Countdown timer set to correct end date
- [ ] All prices updated to Genesis rates
- [ ] Output multiplier applied
- [ ] Crit rates increased
- [ ] GD withdrawal disabled

### Marketing
- [ ] Launch announcement written
- [ ] Social media posts scheduled
- [ ] Community channels prepared
- [ ] Tutorial videos recorded
- [ ] FAQ document ready
- [ ] Press release (if applicable)

### Monitoring
- [ ] Admin dashboard accessible
- [ ] Alert system configured
- [ ] Metrics tracking set up
- [ ] Backup plan documented
- [ ] Emergency contacts listed

### Legal
- [ ] Terms of Service updated
- [ ] Risk disclaimers added
- [ ] Age verification implemented
- [ ] Geo-blocking configured (if needed)

---

**Document Version**: 2.0 (Genesis Pump Edition)  
**Last Updated**: 2026-01-25  
**Status**: Ready for Design Phase  
**Next Step**: Create design.md with technical architecture
