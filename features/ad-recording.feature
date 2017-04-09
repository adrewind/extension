
Feature: Ad fragment selection
  As an internet user
  In order to report about ad inside video
  I should be able to select ad fragment

  Scenario: Recording ad fragment
    Given I am watch "mKzLoZFz8PE" video
    When I click ".adr-mark-ad-button" element
    And I click ".adr-ad-help-text" element
    Then I should see ".adr-ad-selection" element
