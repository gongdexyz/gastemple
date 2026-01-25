# Demo Mode Testing Guide 🎬

## Quick Start

### Test URLs (Local Development)
```
http://localhost:5173/?demo=tourist
http://localhost:5173/?demo=pilgrim
http://localhost:5173/?demo=monk
http://localhost:5173/?demo=abbot
```

### Test URLs (Production)
```
https://your-domain.com/?demo=tourist
https://your-domain.com/?demo=pilgrim
https://your-domain.com/?demo=monk
https://your-domain.com/?demo=abbot
```

## Visual Checklist

### ✅ What You Should See

#### 1. Demo Mode Banner (Top of Dialog)
```
┌─────────────────────────────────────┐
│  ✨ 🎬 DEMO MODE ✨                 │
│  Simulated as Abbot tier for demo   │
└─────────────────────────────────────┘
```

#### 2. User Status with DEMO Badge
```
Your Status
👨‍🦲 方丈 [DEMO]  [Refresh]
```

#### 3. Disclaimer Notice (Before Withdrawal Button)
```
⚠️ Demo Simulation Notice
This is a simulated demonstration. No real 
blockchain transactions will occur...
```

#### 4. Disabled Withdrawal Button
```
┌─────────────────────────────────────┐
│  🎬 Demo Mode (View Only)           │
└─────────────────────────────────────┘
```

## Testing Scenarios

### Scenario 1: Tourist (High Tax)
**URL**: `?demo=tourist`
**Expected**:
- SKR Balance: 0 SKR
- Fee Rate: 30% (red)
- Withdraw 1000 $GONGDE → Net: 700 $GONGDE
- Shows upgrade tip to save money

### Scenario 2: Pilgrim (Normal Tax)
**URL**: `?demo=pilgrim`
**Expected**:
- SKR Balance: 100 SKR
- Fee Rate: 10% (red)
- Withdraw 1000 $GONGDE → Net: 900 $GONGDE
- Shows upgrade tip to save money

### Scenario 3: Monk (Tax-Free)
**URL**: `?demo=monk`
**Expected**:
- SKR Balance: 1,000 SKR
- Fee Rate: 0% (cyan)
- Withdraw 1000 $GONGDE → Net: 1000 $GONGDE
- Shows upgrade tip for bonus

### Scenario 4: Abbot (Bonus!)
**URL**: `?demo=abbot`
**Expected**:
- SKR Balance: 5,000 SKR
- Fee Rate: +5% (green)
- Withdraw 1000 $GONGDE → Net: 1050 $GONGDE
- No upgrade tip (max tier)

## Interaction Testing

### ✅ Should Work
- [x] Open withdrawal dialog
- [x] See Demo Mode banner
- [x] See DEMO badge on tier
- [x] Input withdrawal amount
- [x] See calculations update
- [x] See disclaimer notice
- [x] See tier comparison table

### ❌ Should NOT Work
- [ ] Click "Refresh" button (disabled)
- [ ] Click "Confirm Withdrawal" button (disabled)
- [ ] Actual blockchain transactions

## Hackathon Demo Flow

### 5-Minute Demo Script

**Minute 1: Introduction**
```
"Let me show you our innovative staking incentive system..."
Open: ?demo=tourist
```

**Minute 2: Problem**
```
"Without staking, users face 30% withdrawal tax"
Show: 1000 GD → 700 GD net
```

**Minute 3: Solution**
```
"By staking SKR tokens, users reduce their tax"
Switch: ?demo=pilgrim (10% tax)
Switch: ?demo=monk (0% tax)
```

**Minute 4: Reward**
```
"Top stakers even get bonuses!"
Switch: ?demo=abbot (-5% bonus)
Show: 1000 GD → 1050 GD net
```

**Minute 5: Impact**
```
"This creates a positive feedback loop:
- Users stake SKR → Lower fees
- More staking → Higher SKR value
- Higher value → More users stake"
```

## Troubleshooting

### Issue: Demo Mode Not Showing
**Solution**: Check URL parameter spelling
- ✅ `?demo=abbot`
- ❌ `?demo=abbott` (typo)
- ❌ `?Demo=abbot` (case sensitive)

### Issue: Withdrawal Button Not Disabled
**Solution**: Refresh page with demo parameter

### Issue: No DEMO Badge
**Solution**: Clear browser cache and reload

### Issue: Calculations Wrong
**Solution**: This is expected - calculations are correct for demo tier

## Browser Compatibility

Tested on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Performance

- Demo mode adds ~1 second delay (simulates real verification)
- No actual blockchain calls
- No network requests
- Instant tier switching

## Security Notes

⚠️ **Important**: Demo mode is for demonstration only!
- No real transactions occur
- No real SKR verification
- No real withdrawals processed
- Users cannot exploit demo mode for real gains

## Ready for Production?

Before going live:
- [ ] Test all demo URLs
- [ ] Verify disclaimer text
- [ ] Check bilingual support
- [ ] Test on mobile devices
- [ ] Verify button states
- [ ] Test tier calculations
- [ ] Review security implications

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify URL parameter format
3. Clear cache and reload
4. Check network tab (should see no blockchain calls)

---

**Status**: ✅ Ready for Hackathon Demo
**Date**: January 26, 2026
**Next Demo**: January 27, 2026
