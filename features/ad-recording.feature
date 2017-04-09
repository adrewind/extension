
Feature: Ad fragment selection
  As an internet user
  In order to report about ad inside video
  I should be able to select ad fragment

  Scenario: Recording ad fragment
    Given I am watch "mKzLoZFz8PE" video
    When I click ".adr-mark-ad-button" element
    And I click ".adr-ad-help-text" element
    And I wait "5" seconds
    And I click ".adr-ad-help-text" element
    Then I should see ".adr-ad-selection" element

  Scenario: Keeping selection bar opened while it activated
    Given I am watch "4oqfodY2Lz0" video
    When I click ".adr-mark-ad-button" element
    And I wait "5" seconds
    Then I should see ".adr-ad-selection" element

  Scenario: Hiding disable annotations while selection bar is activated
    Given I am watch "2vMH8lITTCE" video
    When I enable annotations
    And I click ".adr-mark-ad-button" element
    Then Annotations must be disabled

    When I click ".adr-mark-ad-button" element
    Then Annotations must be enabled

  Scenario: Preserve annotations state
    Given I am watch "2vMH8lITTCE" video
    When I disable annotations
    And I click ".adr-mark-ad-button" element
    Then Annotations must be disabled

    When I click ".adr-mark-ad-button" element
    Then Annotations must be disabled
