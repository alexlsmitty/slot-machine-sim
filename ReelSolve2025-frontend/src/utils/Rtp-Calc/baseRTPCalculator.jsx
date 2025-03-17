import React from 'react';

/**
 * Base RTP Calculator class that defines the interface for game-specific calculators
 */
class BaseRTPCalculator {
  /**
   * Get default iteration count for Monte Carlo simulations
   */
  getDefaultIterations() {
    return 100000;
  }
  
  /**
   * Get default simulation type
   */
  getDefaultSimType() {
    return 'theoretical';
  }
  
  /**
   * Get additional options specific to this game type
   */
  getAdditionalOptions() {
    return {};
  }
  
  /**
   * Get game configuration from storage
   */
  async getGameConfiguration() {
    throw new Error('getGameConfiguration must be implemented by subclass');
  }
  
  /**
   * Calculate RTP based on configuration and options
   */
  async calculateRTP(config, options) {
    throw new Error('calculateRTP must be implemented by subclass');
  }
  
  /**
   * Render game-specific configuration options
   */
  renderGameSpecificOptions(options, handleOptionChange) {
    return null;
  }
  
  /**
   * Render game-specific results summary
   */
  renderResultsSummary(results) {
    return null;
  }
  
  /**
   * Render detailed game-specific results
   */
  renderDetailedResults(results) {
    return null;
  }
  
  /**
   * Render game-specific volatility details
   */
  renderVolatilityDetails(volatilityData, results) {
    return null;
  }
}

export default BaseRTPCalculator;