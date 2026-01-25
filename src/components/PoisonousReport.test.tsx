import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { PoisonousReport } from './PoisonousReport'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { CryptoProject } from '../data/mockProjects'

// Mock the stores
vi.mock('../stores/themeStore')
vi.mock('../stores/langStore')

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => <div onClick={onClick} {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
  },
}))

// Sample crypto project for testing
const mockProject: CryptoProject = {
  id: 'test-1',
  name: 'Test Coin',
  ticker: 'TEST',
  chain: 'Ethereum',
  tags: ['DeFi', 'Test'],
  description_cn: '测试项目',
  description_en: 'Test project',
  roast_cn: ['测试吐槽1', '测试吐槽2'],
  roast_en: ['Test roast 1', 'Test roast 2'],
  revenueModel_cn: '测试收入模型',
  revenueModel_en: 'Test revenue model',
  ponziMetrics: {
    narrativeDependency: 20,
    cashFlowSelfSufficiency: 15,
    tokenDependency: 15,
    lateComerRisk: 15,
    exitDependency: 5,
  },
}

describe('PoisonousReport - Property-Based Tests', () => {
  const mockOnClose = vi.fn()
  const mockOnRetry = vi.fn()

  /**
   * Property 1: Pixel Font Application
   * **Validates: Requirements 1.1, 1.2**
   * 
   * For any render of the PoisonousReport component, the Buddha quote text element
   * should have the "font-pixel" CSS class in its className.
   */
  describe('Property 1: Pixel Font Application', () => {
    it('should always apply font-pixel class to Buddha quote text for any theme mode and language', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find the Buddha quote text element (it's wrapped in quotes)
            const quoteElements = container.querySelectorAll('p')
            const buddhaQuoteElement = Array.from(quoteElements).find(
              (el) => el.textContent?.startsWith('"') && el.textContent?.endsWith('"')
            )

            expect(buddhaQuoteElement).toBeDefined()
            expect(buddhaQuoteElement?.className).toContain('font-pixel')
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  /**
   * Property 2: Bold Text Styling
   * **Validates: Requirements 2.1**
   * 
   * For any render of the PoisonousReport component, the Buddha quote text element
   * should have the "font-bold" CSS class in its className.
   */
  describe('Property 2: Bold Text Styling', () => {
    it('should always apply font-bold class to Buddha quote text for any theme mode and language', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find the Buddha quote text element
            const quoteElements = container.querySelectorAll('p')
            const buddhaQuoteElement = Array.from(quoteElements).find(
              (el) => el.textContent?.startsWith('"') && el.textContent?.endsWith('"')
            )

            expect(buddhaQuoteElement).toBeDefined()
            expect(buddhaQuoteElement?.className).toContain('font-bold')
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  /**
   * Property 3: Theme-Based Color Application
   * **Validates: Requirements 3.1**
   * 
   * For any render of the PoisonousReport component, when isDegen is true,
   * the Buddha quote text should have "text-degen-yellow" class, and when
   * isDegen is false, it should have "text-goldman-gold" class.
   */
  describe('Property 3: Theme-Based Color Application', () => {
    it('should apply correct color class based on theme mode', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find the Buddha quote text element
            const quoteElements = container.querySelectorAll('p')
            const buddhaQuoteElement = Array.from(quoteElements).find(
              (el) => el.textContent?.startsWith('"') && el.textContent?.endsWith('"')
            )

            expect(buddhaQuoteElement).toBeDefined()
            
            if (mode === 'degen') {
              expect(buddhaQuoteElement?.className).toContain('text-degen-yellow')
            } else {
              expect(buddhaQuoteElement?.className).toContain('text-goldman-gold')
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  /**
   * Property 4: Attribution Text Presence
   * **Validates: Requirements 3.3**
   * 
   * For any render of the PoisonousReport component, the attribution text
   * should be present and should contain "佛曰" when language is Chinese
   * or "Buddha says" when language is English.
   */
  describe('Property 4: Attribution Text Presence', () => {
    it('should display correct attribution text based on language', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find attribution text element (small text below the quote)
            const attributionElements = container.querySelectorAll('p.text-xs')
            const attributionElement = Array.from(attributionElements).find(
              (el) => el.textContent?.includes('—')
            )

            expect(attributionElement).toBeDefined()
            
            if (lang === 'cn') {
              expect(attributionElement?.textContent).toContain('佛曰')
            } else {
              expect(attributionElement?.textContent).toContain('Buddha says')
            }
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  /**
   * Property 5: Layout Structure Preservation
   * **Validates: Requirements 3.4, 5.3, 6.1**
   * 
   * For any render of the PoisonousReport component, the quote section should
   * maintain the structural CSS classes including "text-lg" for sizing and
   * appropriate layout classes.
   */
  describe('Property 5: Layout Structure Preservation', () => {
    it('should maintain structural CSS classes for any theme mode and language', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find the Buddha quote text element
            const quoteElements = container.querySelectorAll('p')
            const buddhaQuoteElement = Array.from(quoteElements).find(
              (el) => el.textContent?.startsWith('"') && el.textContent?.endsWith('"')
            )

            expect(buddhaQuoteElement).toBeDefined()
            expect(buddhaQuoteElement?.className).toContain('text-lg')
          }
        ),
        { numRuns: 10 }
      )
    })
  })

  /**
   * Property 6: Italic Class Removal
   * **Validates: Requirements 4.1**
   * 
   * For any render of the PoisonousReport component, the Buddha quote text
   * element should NOT have the "italic" class in its className.
   */
  describe('Property 6: Italic Class Removal', () => {
    it('should not have italic class on Buddha quote text for any theme mode and language', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('goldman', 'degen'),
          fc.constantFrom('cn', 'en'),
          (mode, lang) => {
            // Setup mocks
            vi.mocked(useThemeStore).mockReturnValue({
              mode: mode as 'goldman' | 'degen',
              isTransitioning: false,
              toggleMode: vi.fn(),
              setMode: vi.fn(),
              triggerGlitch: vi.fn(),
            })
            vi.mocked(useLangStore).mockReturnValue({
              lang: lang as 'cn' | 'en',
              setLang: vi.fn(),
              toggleLang: vi.fn(),
            })

            const { container } = render(
              <PoisonousReport
                project={mockProject}
                onClose={mockOnClose}
                onRetry={mockOnRetry}
              />
            )

            // Find the Buddha quote text element
            const quoteElements = container.querySelectorAll('p')
            const buddhaQuoteElement = Array.from(quoteElements).find(
              (el) => el.textContent?.startsWith('"') && el.textContent?.endsWith('"')
            )

            expect(buddhaQuoteElement).toBeDefined()
            expect(buddhaQuoteElement?.className).not.toContain('italic')
          }
        ),
        { numRuns: 10 }
      )
    })
  })
})
